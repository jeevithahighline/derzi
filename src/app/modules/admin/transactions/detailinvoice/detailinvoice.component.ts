import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { ToastService } from '../../../../core/services/toastr.service';
import { MATERIAL_IMPORTS } from '../../../material.import';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-detailinvoice',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './detailinvoice.component.html',
  styleUrl: './detailinvoice.component.scss'
})
export class DetailinvoiceComponent {

  editMode = false;   // ✅ track add/edit
  orderId: string | null = null;
  invoiceId: string | null = null;
  editId: string | null;
  usertoken: any;
  orderDetails: any;

  constructor(private _router: Router,private fb: FormBuilder,private route: ActivatedRoute,private _masterservice: OrderService,private _toastrService: ToastService) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'];
      this.invoiceId = params['invoiceId'];
      console.log('Order ID:', this.orderId);
      console.log('Invoice ID:', this.invoiceId);

      // You can now call your service here:
      // this.getInvoiceDetails(this.orderId, this.invoiceId);
    });
    
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

  goBack() {
    this._router.navigate(['/invoices']);  // 👈 make sure `/orders` is your all orders route
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
      doc.save(`Invoice_${this.orderDetails?.orderId || 'Report'}.pdf`);
    })
    .catch((error) => {
      console.error('PDF generation failed:', error);
    })
    .finally(() => {
      this.isLoadingPDF = false; // hide loader
    });
}



}

