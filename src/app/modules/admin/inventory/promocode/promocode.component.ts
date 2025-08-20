import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';

@Component({
  selector: 'app-promocode',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './promocode.component.html',
  styleUrl: './promocode.component.scss'
})

export class PromocodeComponent {
  searchText = '';

  countries = [
    { id: 1, code: 'T20',description:'Get 20% off on your first order'},
    { id: 2, code: 'DEAL100',description:'50% off for new customers' }
  ];

  filteredCountries() {
    return this.countries.filter(c =>
      c.code.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editCountry(country: any) {
    alert(`Editing ${country.name}`);
  }

  deleteCountry(country: any) {
    alert(`Deleting ${country.name}`);
  }

}

