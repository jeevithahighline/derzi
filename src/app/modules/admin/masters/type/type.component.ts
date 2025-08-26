import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { TypeformComponent } from './typeform/typeform.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrl: './type.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class TypeComponent {
  searchText = '';
  totalItems = 2;

  constructor(private dialog: MatDialog) {}

  countries = [
    { id: 1, name: 'Normal'},
    { id: 2, name: 'Casual' }
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
    const dialogRef = this.dialog.open(TypeformComponent, {
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

