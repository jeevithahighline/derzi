import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { MatDialog } from '@angular/material/dialog';
import { PaymentmethodformComponent } from './paymentmethodform/paymentmethodform.component';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';
import { PaymentMethodService } from '../../../../core/services/paymentmethod.service';
import { ToastService } from '../../../../core/services/toastr.service';
@Component({
  selector: 'app-paymentmethods',
  templateUrl: './paymentmethods.component.html',
  styleUrl: './paymentmethods.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class PaymentmethodsComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;
  page = 1;
  pageSize = 10;
  pageIndex = 0;
  usertoken:any;
  selectedIds: string[] = [];
  constructor(private dialog: MatDialog,private _masterservice: PaymentMethodService,private _toastrService: ToastService) {}

  payments: any[] = [];

  ngOnInit(): void {
    this.loadPaymentMethod();
  }

  loadPaymentMethod(page: number = this.page, size: number = this.pageSize) {
    const token = localStorage.getItem('usertoken'); 
    if (token) {
      this._masterservice.getAllPaymentMethod(token, this.page, this.pageSize).subscribe({
        next: (res: any) => {
          this.payments = res.data.docs || [];
          this.totalItems = res.data.totalDocs || 0;  // backend must return total count
          this.page = res.data.page || page;
          this.pageSize = res.data.limit || size;
        },
        error: (err) => {
          console.error('Error fetching brand', err);
        }
      });
    }
  }

  filteredData() {
    return this.payments.filter(c =>
      c.methodname.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editpayment(payment: any, index: number) {
    const dialogRef = this.dialog.open(PaymentmethodformComponent, {
      width: '500px',
      disableClose: true,
      data: { payment }   // 👈 pass existing payment to dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPaymentMethod();
      }
    });
  }
   

  openAddForm() {
    const dialogRef = this.dialog.open(PaymentmethodformComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPaymentMethod();
      }
    });
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.payments.forEach(payment => payment.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.payments.every(payment => payment.isSelected);
  }

  deletepayment(data) {

    this.selectedIds = data._id;
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // ✅ Call delete API
        this._masterservice.deletePaymentMethod(this.selectedIds,this.usertoken).subscribe({
          next: () => {
            this._toastrService.showSuccess("Deleted Successfully");
            this.loadPaymentMethod(); // refresh table
          },
          error: () => {
            this._toastrService.showError("Deletion failed");
          }
        });
      } else {
        this._toastrService.showError("Deletion cancelled by user");
      }
    });
  }

  deleteSelected() {
    const selectedIds = this.payments.filter(item => item.isSelected).map(item => item._id);
  
    if (selectedIds.length === 0) {
      this._toastrService.showError("Please select at least one record to delete.");
      return;
    }
  
    // ✅ Confirmation popup
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // ✅ Prepare request body
        const requestBody = { deleteIds: selectedIds };
  
        // ✅ Call multi-delete API
        this._masterservice.deleteMultipleData(requestBody, this.usertoken).subscribe({
          next: () => {
            this._toastrService.showSuccess("Selected method deleted successfully");
            this.loadPaymentMethod(); // refresh table
          },
          error: () => {
            this._toastrService.showError("Failed to delete selected method");
          }
        });
      } else {
        this._toastrService.showError("Deletion cancelled by user");
      }
    });
  }

  onPageChange(event: any) {
    this.page = event.pageIndex + 1;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPaymentMethod(this.page, this.pageSize);
  }

}



