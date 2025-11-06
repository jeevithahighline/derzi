import { Component,Inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { MatDialog } from '@angular/material/dialog';
import { ColorformComponent } from './colorform/colorform.component';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';
import { ColorService } from '../../../../core/services/color.service';
import { ToastService } from '../../../../core/services/toastr.service';

@Component({
  selector: 'app-color',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './color.component.html',
  styleUrl: './color.component.scss'
})

export class ColorComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;
  page = 1;
  pageSize = 10;
  pageIndex = 0;
  usertoken:any;
  selectedIds: string[] = [];
  constructor(private dialog: MatDialog,private _masterservice: ColorService,private _toastrService: ToastService) {}
  
  colors: any[] = [];

  ngOnInit(): void {
    this.loadColor();
  }

  loadColor(page: number = this.page, size: number = this.pageSize) {
    const token = localStorage.getItem('usertoken'); 
    if (token) {
      this._masterservice.getAllColor(token, this.page, this.pageSize).subscribe({
        next: (res: any) => {
          this.colors = res.data.docs || [];
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
    return this.colors.filter(c =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editcolor(color: any, index: number) {

    //alert(banner.id);
    const dialogRef = this.dialog.open(ColorformComponent, {
      width: '500px',
      disableClose: true,
      data: { color }   // 👈 pass existing banner to dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadColor();
      }
    });
  }
  
  openAddForm() {
    const dialogRef = this.dialog.open(ColorformComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadColor();
      }
    });
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.colors.forEach(color => color.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.colors.every(color => color.isSelected);
  }
  
  deletecolor(data) {

    this.selectedIds = data._id;
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // ✅ Call delete API
        this._masterservice.deleteColor(this.selectedIds,this.usertoken).subscribe({
          next: () => {
            this._toastrService.showSuccess("Deleted Successfully");
            this.loadColor(); // refresh table
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
    const selectedIds = this.colors.filter(item => item.isSelected).map(item => item._id);
  
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
            this._toastrService.showSuccess("Selected color deleted successfully");
            this.loadColor(); // refresh table
          },
          error: () => {
            this._toastrService.showError("Failed to delete selected color");
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
    this.loadColor(this.page, this.pageSize);
  }
}