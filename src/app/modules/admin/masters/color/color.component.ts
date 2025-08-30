import { Component,Inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { MatDialog } from '@angular/material/dialog';
import { ColorformComponent } from './colorform/colorform.component';
@Component({
  selector: 'app-color',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './color.component.html',
  styleUrl: './color.component.scss'
})

export class ColorComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;

  constructor(private dialog: MatDialog) {}
  countries = [
    { id: 1, name: 'Pink',isSelected: false},
    { id: 2, name: 'Blue' ,isSelected: false}
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
    const dialogRef = this.dialog.open(ColorformComponent, {
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