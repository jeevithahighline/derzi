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
  masterSelected: boolean = false;
  constructor(private dialog: MatDialog) {}

  countries = [
    { id: 1, name: 'Bahrain',code:'BHD', flag: 'https://flagcdn.com/w20/bh.png',isSelected: false },
    { id: 2, name: 'United Arab Emirates',code:'UAE', flag: 'https://flagcdn.com/w20/ae.png',isSelected: false },
    { id: 3, name: 'United States', code:'US', flag: 'https://flagcdn.com/w20/us.png',isSelected: false }
  ];

  filteredData() {
    return this.countries.filter(c =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editCountry(country: any, index: number) {
    const dialogRef = this.dialog.open(CountryformComponent, {
      width: '500px',
      disableClose: true,
      data: { country }   // 👈 pass existing country to dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.countries[index] = result; // 👈 update instead of push
      }
    });
  }
  

  deleteCountry(country: any) {
    //alert(`Deleting ${country.name}`);
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

  // Toggle all checkboxes
  checkUncheckAll() {
    this.countries.forEach(country => country.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.countries.every(country => country.isSelected);
  }

}

