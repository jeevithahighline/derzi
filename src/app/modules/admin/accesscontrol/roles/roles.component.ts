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
  masterSelected: boolean = false;
  constructor(private dialog: MatDialog) {}
  
  countries = [
    { id: 1, name: 'Super Admin', description:"Lorem ipsum",isSelected: false},
    { id: 2, name: 'Staff' , description:"Lorem ipsum",isSelected: false},
    { id: 3, name: 'Management' , description:"Lorem ipsum",isSelected: false}
  ];

  filteredData() {
    return this.countries.filter(c =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editCountry(country: any) {
    //alert(`Editing ${country.name}`);
  }

  deleteCountry(country: any) {
    //alert(`Deleting ${country.name}`);
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

  // Toggle all checkboxes
  checkUncheckAll() {
    this.countries.forEach(country => country.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.countries.every(country => country.isSelected);
  }

}



