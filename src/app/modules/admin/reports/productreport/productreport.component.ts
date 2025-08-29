import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';

@Component({
  selector: 'app-productreport',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './productreport.component.html',
  styleUrl: './productreport.component.scss'
})

export class ProductreportComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;

  countries = [
    { id: 1, name: 'Shirt',description:'Lorem ipsum',isSelected: false},
    { id: 2, name: 'Salwar',description:'Lorem ipsum' ,isSelected: false}
  ];

  filteredCountries() {
    return this.countries.filter(c =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editCountry(country: any) {
    alert(`Editing ${country.name}`);
  }

  deleteCountry(country: any) {
    alert(`Deleting ${country.name}`);
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


