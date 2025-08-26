import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { MatDialog } from '@angular/material/dialog';
import { SizeformComponent } from './sizeform/sizeform.component';

@Component({
  selector: 'app-size',
  templateUrl: './size.component.html',
  styleUrl: './size.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class SizeComponent {
  searchText = '';
  totalItems = 2;

  constructor(private dialog: MatDialog) {}

  countries = [
    { id: 1, name: 'XL'},
    { id: 2, name: 'Medium' }
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
    const dialogRef = this.dialog.open(SizeformComponent, {
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

