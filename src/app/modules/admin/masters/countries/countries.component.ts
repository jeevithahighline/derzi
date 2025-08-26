import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { CountryformComponent } from './countryform/countryform.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class CountriesComponent {
  searchText = '';
  totalItems = 3;

  constructor(private dialog: MatDialog) {}

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

  openAddCountry() {
    const dialogRef = this.dialog.open(CountryformComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.countries.push(result);  // add new country
      }
    });
  }

}

