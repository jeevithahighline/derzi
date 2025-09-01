import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { BrandformComponent } from './brandform/brandform.component';
import { MatDialog } from '@angular/material/dialog';


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
  constructor(private dialog: MatDialog) {}

  brands = [
    { id: 1, name: 'Nike', description:"Lorem ipsum",isSelected: false},
    { id: 2, name: 'Zara' , description:"Lorem ipsum",isSelected: false}
  ];

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
        this.brands[index] = result; // 👈 update instead of push
      }
    });
  }

  deleteCountry(country: any) {
    //alert(`Deleting ${country.name}`);
  }

  openAddForm() {
    const dialogRef = this.dialog.open(BrandformComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.brands.push(result);  // add new country
      }
    });
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.brands.forEach(country => country.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.brands.every(country => country.isSelected);
  }

}

