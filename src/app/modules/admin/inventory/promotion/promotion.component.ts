import { Component,Inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { FormBuilder, FormGroup, Validators,FormArray } from '@angular/forms';
import { Router,ActivatedRoute  } from '@angular/router';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PromotionService } from '../../../../core/services/promotion.service';
import { ToastService } from '../../../../core/services/toastr.service';

@Component({
  selector: 'app-promotion',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './promotion.component.html',
  styleUrl: './promotion.component.scss'
})
export class PromotionComponent {

  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;
  page = 1;
  pageSize = 10;
  pageIndex = 0;
  usertoken:any;
  selectedIds: string[] = [];

  constructor(private _router: Router,private route: ActivatedRoute,private fb: FormBuilder,private dialog: MatDialog,private _promotionservice:PromotionService,private _toastrService: ToastService) {}

  promotion: any[] = [];

  ngOnInit(): void {
    this.loadPromotion();
  }

  loadPromotion(page: number = this.page, size: number = this.pageSize) {
    const token = localStorage.getItem('usertoken'); 
    if (token) {
      this._promotionservice.getAllPromotion(token, this.page, this.pageSize).subscribe({
        next: (res: any) => {
          this.promotion = res.data || [];
          this.totalItems = res.data.length || 0;  // backend must return total count
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
    return this.promotion.filter(c =>
      c.promotionName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editpromotion(promotion: any, index: number) {
    this._router.navigate(['/addpromotion', promotion._id]);
  }


  addpromotion(){
    this._router.navigate(['/addpromotion']);
  }

   // Toggle all checkboxes
   checkUncheckAll() {
    this.promotion.forEach(promotion => promotion.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.promotion.every(promotion => promotion.isSelected);
  }

  deletepromotion(data) {

    this.selectedIds = data._id;
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // ✅ Call delete API
        this._promotionservice.deletePromotion(this.selectedIds,this.usertoken).subscribe({
          next: () => {
            this._toastrService.showSuccess("Deleted Successfully");
            this.loadPromotion(); // refresh table
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
    const selectedIds = this.promotion.filter(item => item.isSelected).map(item => item._id);
  
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
        this._promotionservice.deleteMultipleData(requestBody, this.usertoken).subscribe({
          next: () => {
            this._toastrService.showSuccess("Selected promotion deleted successfully");
            this.loadPromotion(); // refresh table
          },
          error: () => {
            this._toastrService.showError("Failed to delete selected promotion");
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
    this.loadPromotion(this.page, this.pageSize);
  }


}
