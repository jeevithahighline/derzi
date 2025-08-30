import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';

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
  countries = [
    { id: 1, name: 'Shirt',description:'Lorem ipsum',isSelected: false},
    { id: 2, name: 'Salwar',description:'Lorem ipsum',isSelected: false }
  ];

  constructor(private _router: Router) {}

  filteredData() {
    return this.countries.filter(c =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editCountry(country: any) {
    //alert(`Editing ${country.name}`);
  }

  deleteCountry(country: any) {
    //alert(`Deleting ${country.name}`);
  }

  addProduct(){
    this._router.navigate(['/addproduct']);
  }

   // Toggle all checkboxes
   checkUncheckAll() {
    this.countries.forEach(country => country.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.countries.every(country => country.isSelected);
  }

}

