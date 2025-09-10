import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { RoleformComponent } from './roleform/roleform.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';


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
  
  roles = [
    { id: 1, name: 'Super Admin', description:"Lorem ipsum",isSelected: false},
    { id: 2, name: 'Staff' , description:"Lorem ipsum",isSelected: false},
    { id: 3, name: 'Management' , description:"Lorem ipsum",isSelected: false}
  ];

  filteredData() {
    return this.roles.filter(c =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editrole(role: any, index: number) {
    const dialogRef = this.dialog.open(RoleformComponent, {
      width: '500px',
      disableClose: true,
      data: { role }   // 👈 pass existing currency to dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.roles[index] = result; // 👈 update instead of push
      }
    });
  }

  

  deleterole(index: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.roles[index] = result; // 👈 update instead of push
      }
    });
  }

  openAddForm() {
    const dialogRef = this.dialog.open(RoleformComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.roles.push(result);  // add new role
      }
    });
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.roles.forEach(role => role.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.roles.every(role => role.isSelected);
  }

}



