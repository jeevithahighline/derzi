import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { MatDialog } from '@angular/material/dialog';
import { CareformComponent } from './careform/careform.component';
@Component({
  selector: 'app-care',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './care.component.html',
  styleUrl: './care.component.scss'
})

export class CareComponent {
  searchText = '';
  totalItems = 2;

  constructor(private dialog: MatDialog) {}

  countries = [
    { id: 1, name: 'Dry wash'},
    { id: 2, name: 'Normal' }
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

  openAddForm() {
    const dialogRef = this.dialog.open(CareformComponent, {
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
