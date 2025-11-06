import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmdialogComponent } from '../confirmdialog/confirmdialog.component';
import { FaqService } from '../../../core/services/faq.service';
import { ToastService } from '../../../core/services/toastr.service';


@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class FaqComponent {
  searchText = '';
  totalItems = 0;
  masterSelected: boolean = false;
  page = 1;
  pageSize = 10;
  pageIndex = 0;
  usertoken:any;
  selectedIds: string[] = [];
  constructor(private _router: Router,private dialog: MatDialog,private _faqService: FaqService,private _toastrService: ToastService) {}
  
  faqs: any[] = [];
  
  ngOnInit(): void {
    this.loadFAQs();
  }

  loadFAQs(page: number = this.page, size: number = this.pageSize) {
    const token = localStorage.getItem('usertoken'); 
    if (token) {
      this._faqService.getAllFaq(token, this.page, this.pageSize).subscribe({
        next: (res: any) => {
          this.faqs = res.data.docs || [];
          this.totalItems = res.data.totalDocs || 0;  // backend must return total count
          this.page = res.data.page || page;
          this.pageSize = res.data.limit || size;
        },
        error: (err) => {
          console.error('Error fetching faqs', err);
        }
      });
    }
  }

  filteredData() {
    return this.faqs.filter(c =>
      c.question.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editfaq(faq: any, index: number) {
    //alert(banner.id);
    this._router.navigate(['/addfaq', faq._id]);   
  }

  deletefaq(data) {

    this.selectedIds = data._id;
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // ✅ Call delete API
        this._faqService.deleteFaq(this.selectedIds,this.usertoken).subscribe({
          next: () => {
            this._toastrService.showSuccess("Deleted Successfully");
            this.loadFAQs(); // refresh table
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
    const selectedIds = this.faqs.filter(item => item.isSelected).map(item => item._id);
  
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
        this._faqService.deleteMultipleData(requestBody, this.usertoken).subscribe({
          next: () => {
            this._toastrService.showSuccess("Selected faqs deleted successfully");
            this.loadFAQs(); // refresh table
          },
          error: () => {
            this._toastrService.showError("Failed to delete selected faqs");
          }
        });
      } else {
        this._toastrService.showError("Deletion cancelled by user");
      }
    });
  }

  addfaq(){
    this._router.navigate(['/addfaq']);
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.faqs.forEach(faq => faq.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.faqs.every(faq => faq.isSelected);
  }

  onPageChange(event: any) {
    this.page = event.pageIndex + 1;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadFAQs(this.page, this.pageSize);
  }

}


