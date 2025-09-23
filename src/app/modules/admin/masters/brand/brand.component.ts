import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { BrandformComponent } from './brandform/brandform.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';
import { BrandService } from '../../../../core/services/brand.service';
import { ToastService } from '../../../../core/services/toastr.service';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class BrandComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;
  page = 1;
  pageSize = 10;
  pageIndex = 0;
  usertoken:any;
  selectedIds: string[] = [];
  constructor(private dialog: MatDialog,private _brandservice: BrandService,private _toastrService: ToastService) {}

  
  brands: any[] = [];

  ngOnInit(): void {
    this.loadBrand();
  }
  
  loadBrand(page: number = this.page, size: number = this.pageSize) {
    const token = localStorage.getItem('usertoken'); 
    if (token) {
      this._brandservice.getAllBrand(token, this.page, this.pageSize).subscribe({
        next: (res: any) => {
          this.brands = res.data.docs || [];
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
    return this.brands.filter(c =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editbrand(brand: any, index: number) {

    //alert(brand.id);
    const dialogRef = this.dialog.open(BrandformComponent, {
      width: '500px',
      disableClose: true,
      data: { brand }   // 👈 pass existing brand to dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBrand();
      }
    });
  }

  deletebrand(data) {

    this.selectedIds = data._id;
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // ✅ Call delete API
        this._brandservice.deleteBrand(this.selectedIds,this.usertoken).subscribe({
          next: () => {
            this._toastrService.showSuccess("Deleted Successfully");
            this.loadBrand(); // refresh table
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
    const dialogRef = this.dialog.open(BrandformComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBrand()
      }
    });
  }

  deleteSelected(){
    
    const selectedIds = this.brands.filter(item => item.isSelected).map(item => item._id);

    if (selectedIds.length === 0) {
      this._toastrService.showError("Please select at least one record to delete.");
      return;
    }

  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.brands.forEach(brand => brand.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.brands.every(brand => brand.isSelected);
  }

  onPageChange(event: any) {
    this.page = event.pageIndex + 1;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadBrand(this.page, this.pageSize);
  }

}

