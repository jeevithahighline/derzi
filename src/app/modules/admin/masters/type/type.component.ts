import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { TypeformComponent } from './typeform/typeform.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';
import { TypeService } from '../../../../core/services/type.service';
import { ToastService } from '../../../../core/services/toastr.service';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrl: './type.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class TypeComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;
  page = 1;
  pageSize = 10;
  pageIndex = 0;
  usertoken:any;
  selectedIds: string[] = [];

  constructor(private dialog: MatDialog,private _typeservice: TypeService,private _toastrService: ToastService) {}
  
  types: any[] = [];

  ngOnInit(): void {
    this.usertoken = localStorage.getItem('usertoken'); 
    this.loadType();
  }

  loadType(page: number = this.page, size: number = this.pageSize) {
    const token = localStorage.getItem('usertoken'); 
    if (token) {
      this._typeservice.getAllType(token, this.page, this.pageSize).subscribe({
        next: (res: any) => {
          this.types = res.data.docs || [];
          this.totalItems = res.data.totalDocs || 0;  // backend must return total count
          this.page = res.data.page || page;
          this.pageSize = res.data.limit || size;
        },
        error: (err) => {
          console.error('Error fetching type', err);
        }
      });
    }
  }

  filteredData() {
    return this.types.filter(c =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  edittype(type: any, index: number) {
    const dialogRef = this.dialog.open(TypeformComponent, {
      width: '500px',
      disableClose: true,
      data: { type }   // 👈 pass existing type to dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadType();
      }
    });
  }
  

  deletetype(data) {

    this.selectedIds = data._id;
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // ✅ Call delete API
        this._typeservice.deleteType(this.selectedIds,this.usertoken).subscribe({
          next: () => {
            this._toastrService.showSuccess("Deleted Successfully");
            this.loadType(); // refresh table
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
    const dialogRef = this.dialog.open(TypeformComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadType();
      }
    });
  }

  deleteSelected(){
    
    const selectedIds = this.types.filter(item => item.isSelected).map(item => item._id);

    if (selectedIds.length === 0) {
      this._toastrService.showError("Please select at least one record to delete.");
      return;
    }

  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.types.forEach(type => type.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.types.every(type => type.isSelected);
  }

  onPageChange(event: any) {
    this.page = event.pageIndex + 1;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadType(this.page, this.pageSize);
  }

}

