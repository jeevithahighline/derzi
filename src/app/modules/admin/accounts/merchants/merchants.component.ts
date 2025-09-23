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
  selectedIds: string[] = [];
  constructor(private _router: Router,private dialog: MatDialog,private _accountService: MerchantService,private _toastrService: ToastService) {}


  merchants: any[] = [];
  
  ngOnInit(): void {
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
    this._router.navigate(['/addmerchant', merchant.id]);   
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
        // ✅ Call delete API
        this._accountService.deleteMerchant(this.selectedIds,this.usertoken).subscribe({
          next: () => {
            this._toastrService.showSuccess("Deleted Successfully");
            this.loadmerchants(); // refresh table
          },
          error: () => {
            this._toastrService.showError("Deletion failed");
          }
        });
      } else {
        this._toastrService.showError("Deletion cancelled by merchant");
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

}