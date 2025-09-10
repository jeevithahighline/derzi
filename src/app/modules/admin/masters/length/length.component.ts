import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { MatDialog } from '@angular/material/dialog';
import { LengthformComponent } from './lengthform/lengthform.component';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';

@Component({
  selector: 'app-length',
  templateUrl: './length.component.html',
  styleUrl: './length.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class LengthComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;
  constructor(private dialog: MatDialog) {}
  lengths = [
    { id: 1, name: 'Shorts',isSelected: false},
    { id: 2, name: 'Mini Skirts',isSelected: false }
  ];

  filteredData() {
    return this.lengths.filter(c =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editlength(length: any, index: number) {

    //alert(banner.id);
    const dialogRef = this.dialog.open(LengthformComponent, {
      width: '500px',
      disableClose: true,
      data: { length }   // 👈 pass existing banner to dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.lengths[index] = result; // 👈 update instead of push
      }
    });
  }

  deletelength(index: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.lengths[index] = result; // 👈 update instead of push
      }
    });
  }

  openAddForm() {
    const dialogRef = this.dialog.open(LengthformComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.lengths.push(result);  // add new length
      }
    });
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.lengths.forEach(length => length.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.lengths.every(length => length.isSelected);
  }

}


