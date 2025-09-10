import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { GroupformComponent } from './groupform/groupform.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';

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
  
  groups = [
    { id: 1, name: 'Premium Merchants', description:"High-profile clothing brands with large inventories",isSelected: false},
    { id: 2, name: 'Local Boutiques' , description:"Small-scale clothing shops focused on regional styles",isSelected: false}
  ];

  filteredData() {
    return this.groups.filter(c =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editgroup(group: any, index: number) {
    const dialogRef = this.dialog.open(GroupformComponent, {
      width: '500px',
      disableClose: true,
      data: { group }   // 👈 pass existing currency to dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.groups[index] = result; // 👈 update instead of push
      }
    });
  }

 
  deletegroup(index: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.groups[index] = result; // 👈 update instead of push
      }
    });
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.groups.forEach(group => group.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.groups.every(group => group.isSelected);
  }

  openAddForm() {
    const dialogRef = this.dialog.open(GroupformComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.groups.push(result);  // add new group
      }
    });
  }

}


