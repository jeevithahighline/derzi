import { Component,Inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { MatDialog } from '@angular/material/dialog';
import { ColorformComponent } from './colorform/colorform.component';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';


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
  colors = [
    { id: 1, name: 'Pink',isSelected: false},
    { id: 2, name: 'Blue' ,isSelected: false}
  ];

  filteredData() {
    return this.colors.filter(c =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editcolor(color: any, index: number) {

    //alert(banner.id);
    const dialogRef = this.dialog.open(ColorformComponent, {
      width: '500px',
      disableClose: true,
      data: { color }   // 👈 pass existing banner to dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.colors[index] = result; // 👈 update instead of push
      }
    });
  }


  deletecolor(color: any) {
    //alert(`Deleting ${color.name}`);
  }

  openAddForm() {
    const dialogRef = this.dialog.open(ColorformComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.colors.push(result);  // add new color
      }
    });
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.colors.forEach(color => color.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.colors.every(color => color.isSelected);
  }

}