import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MATERIAL_IMPORTS } from '../../../material.import';


@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class CountriesComponent {
  searchText = '';

  countries = [
    { id: 1, name: 'Bahrain', flag: 'https://flagcdn.com/w20/bh.png' },
    { id: 2, name: 'United Arab Emirates', flag: 'https://flagcdn.com/w20/ae.png' },
    { id: 3, name: 'United States', flag: 'https://flagcdn.com/w20/us.png' }
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
