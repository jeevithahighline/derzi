import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { MatDialog } from '@angular/material/dialog';
import { CareformComponent } from './careform/careform.component';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';


@Component({
  selector: 'app-care',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './care.component.html',
  styleUrl: './care.component.scss'
})

export class CareComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;
  constructor(private dialog: MatDialog) {}

  cares = [
    { id: 1, name: 'Dry wash',isSelected: false},
    { id: 2, name: 'Normal' ,isSelected: false}
  ];

  filteredData() {
    return this.cares.filter(c =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }  

  editcare(care: any, index: number) {

    //alert(banner.id);
    const dialogRef = this.dialog.open(CareformComponent, {
      width: '500px',
      disableClose: true,
      data: { care }   // 👈 pass existing banner to dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cares[index] = result; // 👈 update instead of push
      }
    });
  }

  deletecare(care: any) {
    //alert(`Deleting ${care.name}`);
  }

  openAddForm() {
    const dialogRef = this.dialog.open(CareformComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cares.push(result);  // add new care
      }
    });
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.cares.forEach(care => care.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.cares.every(care => care.isSelected);
  }

}
