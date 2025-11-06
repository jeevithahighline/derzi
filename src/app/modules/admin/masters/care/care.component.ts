import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { MatDialog } from '@angular/material/dialog';
import { CareformComponent } from './careform/careform.component';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';
import { CareService } from '../../../../core/services/care.service';
import { ToastService } from '../../../../core/services/toastr.service';


@Component({
  selector: 'app-care',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './care.component.html',
  styleUrl: './care.component.scss'
})

export class CareComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;
  page = 1;
  pageSize = 10;
  pageIndex = 0;
  usertoken:any;
  selectedIds: string[] = [];
  constructor(private dialog: MatDialog,private _masterservice: CareService,private _toastrService: ToastService) {}

  cares: any[] = [];
  
  ngOnInit(): void {
    this.loadCare();
  }

  loadCare(page: number = this.page, size: number = this.pageSize) {
    const token = localStorage.getItem('usertoken'); 
    if (token) {
      this._masterservice.getAllCare(token, this.page, this.pageSize).subscribe({
        next: (res: any) => {
          this.cares = res.data.docs || [];
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
    return this.cares.filter(c =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }  

  editcare(care: any, index: number) {

    //alert(banner.id);
    const dialogRef = this.dialog.open(CareformComponent, {
      width: '500px',
      disableClose: true,
      data: { care }   // 👈 pass existing banner to dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
       this.loadCare();
      }
    });
  }

  
  openAddForm() {
    const dialogRef = this.dialog.open(CareformComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCare();
      }
    });
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.cares.forEach(care => care.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.cares.every(care => care.isSelected);
  }

  deletecare(data) {

    this.selectedIds = data._id;
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // ✅ Call delete API
        this._masterservice.deleteCare(this.selectedIds,this.usertoken).subscribe({
          next: () => {
            this._toastrService.showSuccess("Deleted Successfully");
            this.loadCare(); // refresh table
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
    const selectedIds = this.cares.filter(item => item.isSelected).map(item => item._id);
  
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
            this._toastrService.showSuccess("Selected care deleted successfully");
            this.loadCare(); // refresh table
          },
          error: () => {
            this._toastrService.showError("Failed to delete selected care");
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
    this.loadCare(this.page, this.pageSize);
  }

}
