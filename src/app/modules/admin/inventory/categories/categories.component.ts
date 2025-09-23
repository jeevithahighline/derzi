import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { CategoryformComponent } from './categoryform/categoryform.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';
import { CategoryService } from '../../../../core/services/category.service';
import { ToastService } from '../../../../core/services/toastr.service';

@Component({
  selector: 'app-categories',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})

export class CategoriesComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;
  page = 1;
  pageSize = 10;
  pageIndex = 0;
  usertoken:any;
  selectedIds: string[] = [];
  constructor(private dialog: MatDialog,private _categoryservice: CategoryService,private _toastrService: ToastService) {}

  categories: any[] = [];

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(page: number = this.page, size: number = this.pageSize) {
    const token = localStorage.getItem('usertoken'); 
    if (token) {
      this._categoryservice.getAllCategory(token, this.page, this.pageSize).subscribe({
        next: (res: any) => {
          this.categories = res.data.docs || [];
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
    return this.categories.filter(c =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editcategory(category: any, index: number) {
     //alert(banner.id);
     const dialogRef = this.dialog.open(CategoryformComponent, {
      width: '500px',
      disableClose: true,
      data: { category }   // 👈 pass existing banner to dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
      }
    });
  }  

  openAddForm() {
    const dialogRef = this.dialog.open(CategoryformComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
      }
    });
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.categories.forEach(category => category.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.categories.every(category => category.isSelected);
  }

  deletecategory(data) {

    this.selectedIds = data._id;
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // ✅ Call delete API
        this._categoryservice.deleteCategory(this.selectedIds,this.usertoken).subscribe({
          next: () => {
            this._toastrService.showSuccess("Deleted Successfully");
            this.loadCategories(); // refresh table
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

  onPageChange(event: any) {
    this.page = event.pageIndex + 1;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCategories(this.page, this.pageSize);
  }

}

