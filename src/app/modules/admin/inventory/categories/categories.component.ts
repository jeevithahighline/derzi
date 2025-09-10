import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { CategoryformComponent } from './categoryform/categoryform.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';


@Component({
  selector: 'app-categories',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})

export class CategoriesComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;
  constructor(private dialog: MatDialog) {}

  categories = [
    { id: 1, name: 'Men',isSelected: false},
    { id: 2, name: 'Women',isSelected: false }
  ];

  filteredData() {
    return this.categories.filter(c =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editcategory(category: any, index: number) {
     //alert(banner.id);
     const dialogRef = this.dialog.open(CategoryformComponent, {
      width: '500px',
      disableClose: true,
      data: { category }   // 👈 pass existing banner to dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categories[index] = result; // 👈 update instead of push
      }
    });
  }

  deletecategory(index: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categories[index] = result; // 👈 update instead of push
      }
    });
  }

  openAddForm() {
    const dialogRef = this.dialog.open(CategoryformComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categories.push(result);  // add new category
      }
    });
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.categories.forEach(category => category.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.categories.every(category => category.isSelected);
  }

}

