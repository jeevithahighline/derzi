import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { GroupformComponent } from './groupform/groupform.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class GroupsComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;

  constructor(private dialog: MatDialog) {}
  
  countries = [
    { id: 1, name: 'Premium Merchants', description:"High-profile clothing brands with large inventories",isSelected: false},
    { id: 2, name: 'Local Boutiques' , description:"Small-scale clothing shops focused on regional styles",isSelected: false}
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

  // Toggle all checkboxes
  checkUncheckAll() {
    this.countries.forEach(country => country.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.countries.every(country => country.isSelected);
  }

  openAddForm() {
    const dialogRef = this.dialog.open(GroupformComponent, {
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


