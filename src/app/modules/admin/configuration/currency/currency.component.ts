import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { MatDialog } from '@angular/material/dialog';
import { CurrencyformComponent } from './currencyform/currencyform.component';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';
import { CurrencyService } from '../../../../core/services/currency.service';
import { ToastService } from '../../../../core/services/toastr.service';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrl: './currency.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class CurrencyComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;
  page = 1;
  pageSize = 10;
  pageIndex = 0;
  usertoken:any;
  selectedIds: string[] = [];
  constructor(private dialog: MatDialog,private _masterservice: CurrencyService,private _toastrService: ToastService) {}

  currencies: any[] = [];

  ngOnInit(): void {
    this.loadCurrency();
  }

  loadCurrency(page: number = this.page, size: number = this.pageSize) {
    const token = localStorage.getItem('usertoken'); 
    if (token) {
      this._masterservice.getAllCurrency(token, this.page, this.pageSize).subscribe({
        next: (res: any) => {
          this.currencies = res.data.docs || [];
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
    return this.currencies.filter(c =>
      c.currency.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editcurrency(currency: any, index: number) {
    const dialogRef = this.dialog.open(CurrencyformComponent, {
      width: '500px',
      disableClose: true,
      data: { currency }   // 👈 pass existing currency to dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCurrency();
      }
    });
  }
  
  openAddForm() {
    const dialogRef = this.dialog.open(CurrencyformComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCurrency();
      }
    });
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.currencies.forEach(currency => currency.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.currencies.every(currency => currency.isSelected);
  }

  deletecurrency(data) {

    this.selectedIds = data._id;
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // ✅ Call delete API
        this._masterservice.deleteCurrency(this.selectedIds,this.usertoken).subscribe({
          next: () => {
            this._toastrService.showSuccess("Deleted Successfully");
            this.loadCurrency(); // refresh table
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
    const selectedIds = this.currencies.filter(item => item.isSelected).map(item => item._id);
  
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
            this._toastrService.showSuccess("Selected currency deleted successfully");
            this.loadCurrency(); // refresh table
          },
          error: () => {
            this._toastrService.showError("Failed to delete selected services");
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
    this.loadCurrency(this.page, this.pageSize);
  }

}


