import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-services',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})

export class ServicesComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;
  countries = [
    { id: 1, name: 'Shirt Stitching',category:'Men',description:'details of what’s included',price:'100 BHD',duration:'2 days',isSelected: false},
    { id: 2, name: 'Blouse Design' ,category:'Women',description:'details of what’s included',price:'100 BHD',duration:'2 weeks',isSelected: false}
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

  addService(){
    this._router.navigate(['/addservice']);
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


