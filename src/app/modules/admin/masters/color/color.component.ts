import { Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
@Component({
  selector: 'app-color',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './color.component.html',
  styleUrl: './color.component.scss'
})

export class ColorComponent {
  searchText = '';
  totalItems = 2;
  countries = [
    { id: 1, name: 'Pink'},
    { id: 2, name: 'Blue' }
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