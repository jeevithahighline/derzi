import { Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { MatDialog } from '@angular/material/dialog';
import { FabricformComponent } from './fabricform/fabricform.component';
@Component({
  selector: 'app-fabric',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './fabric.component.html',
  styleUrl: './fabric.component.scss'
})

export class FabricComponent {
  searchText = '';
  totalItems = 2;

  constructor(private dialog: MatDialog) {}

  countries = [
    { id: 1, name: 'Cotton'},
    { id: 2, name: 'Silk' }
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
    const dialogRef = this.dialog.open(FabricformComponent, {
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

