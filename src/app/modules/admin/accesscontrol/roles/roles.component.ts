import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { RoleformComponent } from './roleform/roleform.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class RolesComponent {
  searchText = '';
  totalItems = 3;

  constructor(private dialog: MatDialog) {}
  
  countries = [
    { id: 1, name: 'Super Admin', description:"Lorem ipsum"},
    { id: 2, name: 'Staff' , description:"Lorem ipsum"},
    { id: 3, name: 'Management' , description:"Lorem ipsum"}
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
    const dialogRef = this.dialog.open(RoleformComponent, {
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



