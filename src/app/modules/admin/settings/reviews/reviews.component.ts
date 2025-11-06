import { Component,Inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';
import { Reviewservice } from '../../../../core/services/review.service';
import { ToastService } from '../../../../core/services/toastr.service';

@Component({
  selector: 'app-reviews',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss'
})

export class ReviewsComponent {
  searchText = '';
  totalItems = 0;
  masterSelected: boolean = false;
  page = 1;
  pageSize = 10;
  pageIndex = 0;
  usertoken:any;
  isSuperAdmin:any;
  selectedIds: string[] = [];
  constructor(private _router: Router,private dialog: MatDialog,private _reviewService: Reviewservice,private _toastrService: ToastService) {}


  reviews: any[] = [];
  
  ngOnInit(): void {
    this.isSuperAdmin = localStorage.getItem('isSuperAdmin'); 
    this.usertoken = localStorage.getItem('usertoken'); 
    this.loadreviews();
  }

  loadreviews(page: number = this.page, size: number = this.pageSize) {
    
    if (this.usertoken) {
      this._reviewService.getAllReviews(this.usertoken, this.page, this.pageSize).subscribe({
        next: (res: any) => {
          this.reviews = res.data || [];
          this.totalItems = res.data.length || 0;  // backend must return total count
          this.page = res.data.page || page;
          this.pageSize = res.data.limit || size;
        },
        error: (err) => {
          console.error('Error fetching reviews', err);
        }
      });
    }
  }

  filteredData() {
    return this.reviews.filter(c =>
      c.comments.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  
  approveReview(data: any) {
    const payload = {
      review_id: data._id,
      merchant_id: ""   // or data.merchant_id depending on structure
    };
  
    this._reviewService.approveReview(payload, this.usertoken)
      .subscribe({
        next: (response) => {
          console.log("✅ Review approved:", response);
          // Optionally refresh the list
          this.loadreviews(this.page, this.pageSize);
        },
        error: (error) => {
          console.error("❌ Failed to approve review:", error);
        }
      });
  }
  
  


  rejectReview(data) {
    const payload = {
      review_id: data._id,
      merchant_id: ""   // or data.merchant_id depending on structure
    };
  
    this._reviewService.rejectReview(payload, this.usertoken)
      .subscribe({
        next: (response) => {
          console.log("✅ Review rejected:", response);
          // Optionally refresh the list
          this.loadreviews(this.page, this.pageSize);
        },
        error: (error) => {
          console.error("❌ Failed to approve review:", error);
        }
      });
  }

  deletereview(data) {
    const payload = {
      review_id: data._id
    };
  
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
          ? this._reviewService.deleteReview(payload, this.usertoken)
          : this._reviewService.deleteReview(payload, this.usertoken);
  
        deleteObservable.subscribe({
          next: () => {
            this._toastrService.showSuccess("Deleted Successfully");
            this.loadreviews(); // refresh table
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

  // Toggle all checkboxes
  checkUncheckAll() {
    this.reviews.forEach(review => review.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.reviews.every(review => review.isSelected);
  }

  

  onPageChange(event: any) {
    this.page = event.pageIndex + 1;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadreviews(this.page, this.pageSize);
  }

}