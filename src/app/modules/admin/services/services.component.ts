import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmdialogComponent } from '../confirmdialog/confirmdialog.component';
import { TailoringService } from '../../../core/services/tailoringservice.service';
import { ToastService } from '../../../core/services/toastr.service';

@Component({
  selector: 'app-services',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})

export class ServicesComponent {
  searchText = '';
  totalItems = 0;
  masterSelected: boolean = false;
  page = 1;
  pageSize = 10;
  pageIndex = 0;
  usertoken:any;
  selectedIds: string[] = [];
  

  constructor(private _router: Router,private dialog: MatDialog,private _tailoringService: TailoringService,private _toastrService: ToastService) {}

  services: any[] = [];

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(page: number = this.page, size: number = this.pageSize) {
    const token = localStorage.getItem('usertoken'); 
    if (token) {
      this._tailoringService.getAlltailoringservice(token, this.page, this.pageSize).subscribe({
        next: (res: any) => {
          this.services = res.data.docs || [];
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
    console.log("check hereeee")
    return this.services.filter(c =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

 
  editservice(service: any, index: number) {

    //alert(banner.id);
    this._router.navigate(['/addservice', service._id]);

   
  }

  deleteservice(data) {

    this.selectedIds = data._id;
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // ✅ Call delete API
        this._tailoringService.deletetailoringservice(this.selectedIds,this.usertoken).subscribe({
          next: () => {
            this._toastrService.showSuccess("Deleted Successfully");
            this.loadServices(); // refresh table
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

  addService(){
    this._router.navigate(['/addservice']);
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.services.forEach(service => service.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.services.every(service => service.isSelected);
  }
  
  deleteSelected() {
    const selectedIds = this.services.filter(item => item.isSelected).map(item => item._id);
  
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
        this._tailoringService.deleteMultipleData(requestBody, this.usertoken).subscribe({
          next: () => {
            this._toastrService.showSuccess("Selected services deleted successfully");
            this.loadServices(); // refresh table
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
    this.loadServices(this.page, this.pageSize);
  }

}


