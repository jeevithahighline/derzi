import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';


@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class GroupsComponent {
  searchText = '';
  totalItems = 2;
  countries = [
    { id: 1, name: 'Premium Merchants', description:"High-profile clothing brands with large inventories"},
    { id: 2, name: 'Local Boutiques' , description:"Small-scale clothing shops focused on regional styles"}
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


