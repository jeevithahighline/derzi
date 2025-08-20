import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';


@Component({
  selector: 'app-length',
  templateUrl: './length.component.html',
  styleUrl: './length.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class LengthComponent {
  searchText = '';

  countries = [
    { id: 1, name: 'Shorts'},
    { id: 2, name: 'Mini Skirts' }
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


