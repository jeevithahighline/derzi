import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';


@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class BrandComponent {
  searchText = '';

  countries = [
    { id: 1, name: 'Nike', description:"Lorem ipsum"},
    { id: 2, name: 'Zara' , description:"Lorem ipsum"}
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

