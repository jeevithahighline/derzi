import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../../core/services/toastr.service';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';
import { Router,ActivatedRoute  } from '@angular/router';
import { BannerService } from '../../../../core/services/banner.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrl: './banners.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class BannersComponent {
  searchText = '';
  totalItems = 0;
  masterSelected: boolean = false;
  page = 1;
  pageSize = 10;
  pageIndex = 0;
  usertoken:any;
  selectedIds: string[] = [];
  isDeleteTriggered:boolean;
  constructor(private dialog: MatDialog,private _toastrService: ToastService,private _router: Router,private _masterservice: BannerService) {}
  

  banners: any[] = [];
  backendUrl = environment.backendurlImages;
  ngOnInit(): void {
    this.loadBanners();
  }

  loadBanners(page: number = this.page, size: number = this.pageSize) {
    const token = localStorage.getItem('usertoken'); 
    if (token) {
      this._masterservice.getAllBanner(token, this.page, this.pageSize).subscribe({
        next: (res: any) => {
          this.banners = res.data.docs || [];
          this.totalItems = res.data.totalDocs || 0;  // backend must return total count
          this.page = res.data.page || page;
          this.pageSize = res.data.limit || size;
        },
        error: (err) => {
          console.error('Error fetching banners', err);
        }
      });
    }
  }

  filteredData() {
    return this.banners.filter(c =>
      c.title.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editbanner(banner: any, index: number) {

    //alert(banner.id);
    this._router.navigate(['/addbanner', banner._id]);

   
  }

  deletebanner(data) {

    this.selectedIds = data._id;
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // ✅ Call delete API
        this._masterservice.deleteBanner(this.selectedIds,this.usertoken).subscribe({
          next: () => {
            this._toastrService.showSuccess("Deleted Successfully");
            this.loadBanners(); // refresh table
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
 

  openAddForm() {
    this._router.navigate(['/addbanner']);
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.banners.forEach(banner => banner.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.banners.every(banner => banner.isSelected);
  }

  deleteSelected() {
    const selectedIds = this.banners.filter(item => item.isSelected).map(item => item._id);
  
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
            this._toastrService.showSuccess("Selected banners deleted successfully");
            this.loadBanners(); // refresh table
          },
          error: () => {
            this._toastrService.showError("Failed to delete selected banners");
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
    this.loadBanners(this.page, this.pageSize);
  }

}

