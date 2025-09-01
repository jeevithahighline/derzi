import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { TypeformComponent } from './typeform/typeform.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrl: './type.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class TypeComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;
  constructor(private dialog: MatDialog) {}

  types = [
    { id: 1, name: 'Normal',isSelected: false},
    { id: 2, name: 'Casual',isSelected: false }
  ];

  filteredData() {
    return this.types.filter(c =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  edittype(type: any, index: number) {
    const dialogRef = this.dialog.open(TypeformComponent, {
      width: '500px',
      disableClose: true,
      data: { type }   // 👈 pass existing type to dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.types[index] = result; // 👈 update instead of push
      }
    });
  }
  
  deletetype(index: any) {
    //alert(`Deleting ${type.name}`);

    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.types[index] = result; // 👈 update instead of push
      }
    });
  }

  openAddForm() {
    const dialogRef = this.dialog.open(TypeformComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.types.push(result);  // add new type
      }
    });
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.types.forEach(type => type.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.types.every(type => type.isSelected);
  }

}

