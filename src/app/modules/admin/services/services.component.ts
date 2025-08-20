import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../material.import';

@Component({
  selector: 'app-services',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})

export class ServicesComponent {
  searchText = '';

  countries = [
    { id: 1, name: 'Shirt Stitching',category:'Men',description:'details of what’s included',price:'100 BHD',duration:'2 days'},
    { id: 2, name: 'Blouse Design' ,category:'Women',description:'details of what’s included',price:'100 BHD',duration:'2 weeks'}
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

}


