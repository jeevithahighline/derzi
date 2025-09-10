import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';

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
  products = [
    { id: 1, name: 'Shirt',description:'Lorem ipsum',isSelected: false},
    { id: 2, name: 'Salwar',description:'Lorem ipsum',isSelected: false }
  ];

  constructor(private _router: Router,private dialog: MatDialog) {}

  filteredData() {
    return this.products.filter(c =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editProduct(product: any, index: number) {
    this._router.navigate(['/addproduct', product.id]);
  }

  deleteProduct(index: number) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.products[index] = result; // 👈 update instead of push
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

}

