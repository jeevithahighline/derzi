import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';


@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrl: './banners.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class BannersComponent {
  searchText = '';
  totalItems = 2;
  countries = [
    { id: 1, title: 'Fashion', content:"Lorem ipsum"},
    { id: 2, title: 'Clothing' , content:"Lorem ipsum"}
  ];

  filteredCountries() {
    return this.countries.filter(c =>
      c.title.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editCountry(country: any) {
    alert(`Editing ${country.name}`);
  }

  deleteCountry(country: any) {
    alert(`Deleting ${country.name}`);
  }

}

