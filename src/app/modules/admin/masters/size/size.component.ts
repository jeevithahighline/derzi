import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { MatDialog } from '@angular/material/dialog';
import { SizeformComponent } from './sizeform/sizeform.component';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';

@Component({
  selector: 'app-size',
  templateUrl: './size.component.html',
  styleUrl: './size.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class SizeComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;
  constructor(private dialog: MatDialog) {}

  sizes = [
    { id: 1, name: 'XL',isSelected: false},
    { id: 2, name: 'Medium',isSelected: false }
  ];

  filteredData() {
    return this.sizes.filter(c =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }


  editsize(size: any, index: number) {

    //alert(banner.id);
    const dialogRef = this.dialog.open(SizeformComponent, {
      width: '500px',
      disableClose: true,
      data: { size }   // 👈 pass existing banner to dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sizes[index] = result; // 👈 update instead of push
      }
    });
  }

  deletesize(index: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sizes[index] = result; // 👈 update instead of push
      }
    });
  }

  openAddForm() {
    const dialogRef = this.dialog.open(SizeformComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sizes.push(result);  // add new size
      }
    });
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.sizes.forEach(size => size.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.sizes.every(size => size.isSelected);
  }

}

