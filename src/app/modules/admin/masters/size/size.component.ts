import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';


@Component({
  selector: 'app-size',
  templateUrl: './size.component.html',
  styleUrl: './size.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class SizeComponent {
  searchText = '';
  totalItems = 2;
  countries = [
    { id: 1, name: 'XL'},
    { id: 2, name: 'Medium' }
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

