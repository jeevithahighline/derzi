import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-promocode',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './promocode.component.html',
  styleUrl: './promocode.component.scss'
})

export class PromocodeComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;
  constructor(private _router: Router) {}

  countries = [
    { id: 1, code: 'T20',description:'Get 20% off on your first order',isSelected: false},
    { id: 2, code: 'DEAL100',description:'50% off for new customers',isSelected: false }
  ];

  filteredData() {
    return this.countries.filter(c =>
      c.code.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editCountry(country: any) {
    //alert(`Editing ${country.name}`);
  }

  deleteCountry(country: any) {
    //alert(`Deleting ${country.name}`);
  }

  addPromocode(){
    this._router.navigate(['/addpromocode']);
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

