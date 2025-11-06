import { Component,Inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';
import { MerchantService } from '../../../../core/services/merchant.service';
import { ToastService } from '../../../../core/services/toastr.service';

@Component({
  selector: 'app-merchants',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './merchants.component.html',
  styleUrl: './merchants.component.scss'
})

export class MerchantsComponent {
  searchText = '';
  totalItems = 0;
  masterSelected: boolean = false;
  page = 1;
  pageSize = 10;
  pageIndex = 0;
  usertoken:any;
  isSuperAdmin:any;
  selectedIds: string[] = [];
  constructor(private _router: Router,private dialog: MatDialog,private _accountService: MerchantService,private _toastrService: ToastService) {}


  merchants: any[] = [];
  
  ngOnInit(): void {
    this.isSuperAdmin = localStorage.getItem('isSuperAdmin'); 
    this.loadmerchants();
  }

  loadmerchants(page: number = this.page, size: number = this.pageSize) {
    const token = localStorage.getItem('usertoken'); 
    if (token) {
      this._accountService.getAllMerchant(token, this.page, this.pageSize).subscribe({
        next: (res: any) => {
          this.merchants = res.data.docs || [];
          this.totalItems = res.data.totalDocs || 0;  // backend must return total count
          this.page = res.data.page || page;
          this.pageSize = res.data.limit || size;
        },
        error: (err) => {
          console.error('Error fetching merchants', err);
        }
      });
    }
  }

  filteredData() {
    return this.merchants.filter(c =>
      c.firstname.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  

  editmerchant(merchant: any, index: number) {
    //alert(banner.id);
    this._router.navigate(['/addmerchant', merchant._id]);   
  }

  deletemerchant(data) {
    this.selectedIds = data._id;
  
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const isSuperAdmin = localStorage.getItem('isSuperAdmin') === 'true';
  
        // ✅ Choose which delete API to call
        const deleteObservable = isSuperAdmin
          ? this._accountService.deleteCompleteMerchant(this.selectedIds, this.usertoken)
          : this._accountService.deleteMerchant(this.selectedIds, this.usertoken);
  
        deleteObservable.subscribe({
          next: () => {
            this._toastrService.showSuccess("Deleted Successfully");
            this.loadmerchants(); // refresh table
          },
          error: () => {
            this._toastrService.showError("Deletion failed");
          }
        });
      } else {
        this._toastrService.showError("Deletion cancelled");
      }
    });
  }

  deleteSelected() {
    const selectedIds = this.merchants.filter(item => item.isSelected).map(item => item._id);
  
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
        this._accountService.deleteMultipleData(requestBody, this.usertoken).subscribe({
          next: () => {
            this._toastrService.showSuccess("Selected merchants deleted successfully");
            this.loadmerchants(); // refresh table
          },
          error: () => {
            this._toastrService.showError("Failed to delete selected merchants");
          }
        });
      } else {
        this._toastrService.showError("Deletion cancelled by user");
      }
    });
  }

  addForm(){
    this._router.navigate(['/addmerchant']);
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.merchants.forEach(merchant => merchant.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.merchants.every(merchant => merchant.isSelected);
  }

  onPageChange(event: any) {
    this.page = event.pageIndex + 1;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadmerchants(this.page, this.pageSize);
  }

}