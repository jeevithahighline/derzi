import { Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
@Component({
  selector: 'app-fabric',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './fabric.component.html',
  styleUrl: './fabric.component.scss'
})

export class FabricComponent {
  searchText = '';
  totalItems = 2;

  countries = [
    { id: 1, name: 'Cotton'},
    { id: 2, name: 'Silk' }
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

