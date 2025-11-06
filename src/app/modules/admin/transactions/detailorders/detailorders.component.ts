import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { ToastService } from '../../../../core/services/toastr.service';
import { MATERIAL_IMPORTS } from '../../../material.import';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DriverService } from '../../../../core/services/driver.service';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-detailorders',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './detailorders.component.html',
  styleUrl: './detailorders.component.scss'
})
export class DetailordersComponent {

  driverList: any[] = [];  // holds driver data

  editMode = false;   // ✅ track add/edit
  orderId: string;
  editId: string | null;
  usertoken: any;
  orderDetails: any;
  page = 1;
  pageSize = 100;

  constructor(private _router: Router,private fb: FormBuilder,private route: ActivatedRoute,private _masterservice: OrderService,private _toastrService: ToastService,private _accountService: DriverService) {}

  ngOnInit(): void {

    this.orderId = this.route.snapshot.paramMap.get('id') || '';
    this.usertoken = localStorage.getItem('usertoken');
    this.loadDrivers(this.usertoken);
 
     // ✅ get id from route
    if (this.orderId) {
      this.editMode = true;
      this.editId = this.orderId;

      this._masterservice.getSpecificOrder(this.orderId, this.usertoken).subscribe({
        next: (res) => {
          this.orderDetails = res.data;
          console.log('Order details:', this.orderDetails);

        
        },
        error: (err) => console.error('Error fetching order details', err)
      });
    }  
  }

  deliveryStatusOptions: string[] = [
    "Order sent to Merchant",
    "Preparing by Merchant",
    "Out for delivery",
    "Assigned to Driver for delivery",
    "Cancelled by User",
    "Cancelled by Merchant",
    "Cancelled by Driver",
    "Delivered",

  ];

  statusTypeMap: any = {
    "Order sent to Merchant":"neworder",
    "Preparing by Merchant": "accepted",
    "Out for delivery": "dispatched",
    "Assigned to Driver for delivery": "assigntodriver",
    "Cancelled by User": "cancelled",
    "Cancelled by Merchant": "rejected",
    "Cancelled by Driver": "rejectedbydriver",
    "Delivered": "delivered"
  };
  
  showDriverColumn = false;

  onDeliveryStatusChange(item: any) {
    // ✅ Toggle driver column visibility dynamically
    this.showDriverColumn = this.orderDetails.items.some(
      (x: any) =>
        x.deliverystatus === 'Assigned to Driver for delivery' ||
        x.deliverystatus === 'Cancelled by Driver'
    );

    // Optional: Reset driverId if not applicable
    if (
      item.deliverystatus !== 'Assigned to Driver for delivery' &&
      item.deliverystatus !== 'Cancelled by Driver'
    ) {
      item.driverId = null;
    }

    console.log('Delivery status changed:', item.deliverystatus);
  }

  onDriverSelect(item: any) {
    console.log('Driver selected for:', item.driverId);
    // Example API call placeholder
    // this.orderService.assignDriver(item._id, item.driverId).subscribe(...)
  }

  updateOrders() {
    if (!this.orderDetails || !this.orderDetails.items) {
      console.error('Order details not loaded');
      return;
    }
  
    const itemsToUpdate = this.orderDetails.items.filter(it => it.deliverystatus);
  
    for (const item of itemsToUpdate) {
      const mappedType = this.statusTypeMap[item.deliverystatus];
  
      if (!mappedType) {
        console.warn(`⚠️ No mapped type found for: ${item.deliverystatus}`);
        continue;
      }
  
      const payload = {
        orderId: this.orderDetails._id || this.orderDetails.orderId,
        itemId: item._id,
        type: mappedType, // ✅ send backend-expected type
        ...(item.driverId ? { driverId: item.driverId } : {})
      };
  
      console.log("📦 Sending Payload:", payload);
  
      this._masterservice
        .updatedeliveryStatus(payload, this.usertoken)
        .pipe(
          tap(res => this.handleApiResponse(res, 'Delivery Status updated successfully', 'Delivery Status creation failed')),
          catchError(error => this.handleError(error, 'Delivery Status is not created. Please contact administrator'))
        )
        .subscribe();
    }
  }
  
  
  
  
  private handleApiResponse(res: any, successMessage: string, failureMessage: string): void {
    console.log("API Response:", res);
  
    if (res.status === true) {
      // ✅ success
      this._toastrService.showSuccess(res.message || successMessage);
      this._router.navigate(['/allorders']);
     
    } else {
      // fallback (in case API returns custom fail format)
      this._toastrService.showSuccess(res.message || failureMessage);
    }
  }
  
  
  private handleError(error: any, fallbackMessage: string): Observable<any> {
    console.error("API Error:", error);
  
    const message =
      error?.error?.message ||   // backend-provided message
      error?.message ||          // Angular HttpErrorResponse message
      fallbackMessage;           // fallback
  
    this._toastrService.showError(message);
  
    return throwError(() => error);
  }

  loadDrivers(token: string) {
    this._accountService.getAllDriver(token, this.page, this.pageSize).subscribe({
      next: (res: any) => {
        this.driverList = res.data.docs || [];
        this.page = res.data.page || this.page;
        this.pageSize = res.data.limit || this.pageSize;
  
        console.log('✅ Drivers loaded:', this.driverList);
      },
      error: (err) => {
        console.error('❌ Error fetching drivers', err);
      }
    });
  }
  goBack() {
    this._router.navigate(['/allorders']);  // 👈 make sure `/orders` is your all orders route
  }

  isLoadingPDF = false; // controls the spinner

downloadPDF() {
  this.isLoadingPDF = true; // show loader

  const DATA: any = document.getElementById('orderDetails');
  if (!DATA) {
    this.isLoadingPDF = false;
    return;
  }

  const doc = new jsPDF('p', 'pt', 'a4');

  html2canvas(DATA, { scale: 2 })
    .then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const imgProps = (doc as any).getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      doc.save(`Order_${this.orderDetails?.orderId || 'Report'}.pdf`);
    })
    .catch((error) => {
      console.error('PDF generation failed:', error);
    })
    .finally(() => {
      this.isLoadingPDF = false; // hide loader
    });
}

  

}
