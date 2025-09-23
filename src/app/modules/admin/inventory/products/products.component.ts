import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';
import { ProductService } from '../../../../core/services/product.service';
import { ToastService } from '../../../../core/services/toastr.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-products',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})

export class ProductsComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;
  page = 1;
  pageSize = 10;
  pageIndex = 0;
  usertoken:any;
  selectedIds: string[] = [];
  backendUrl = environment.backendurlImages;
  constructor(private _router: Router,private dialog: MatDialog,private _productservice: ProductService,private _toastrService: ToastService) {}

  products: any[] = [];

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(page: number = this.page, size: number = this.pageSize) {
    const token = localStorage.getItem('usertoken'); 
    if (token) {
      this._productservice.getAllProduct(token, this.page, this.pageSize).subscribe({
        next: (res: any) => {
          this.products = res.data.products || [];
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
    return this.products.filter(c =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editProduct(product: any, index: number) {
    this._router.navigate(['/addproduct', product._id]);
  }

  deleteProduct(data) {

    this.selectedIds = data._id;
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // ✅ Call delete API
        this._productservice.deleteProduct(this.selectedIds,this.usertoken).subscribe({
          next: () => {
            this._toastrService.showSuccess("Deleted Successfully");
            this.loadProducts(); // refresh table
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

  addProduct(){
    this._router.navigate(['/addproduct']);
  }

   // Toggle all checkboxes
   checkUncheckAll() {
    this.products.forEach(Product => Product.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.products.every(Product => Product.isSelected);
  }

  onPageChange(event: any) {
    this.page = event.pageIndex + 1;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProducts(this.page, this.pageSize);
  }

}

