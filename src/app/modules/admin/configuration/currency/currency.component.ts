import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { MatDialog } from '@angular/material/dialog';
import { CurrencyformComponent } from './currencyform/currencyform.component';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrl: './currency.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class CurrencyComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;
  constructor(private dialog: MatDialog) {}

  currencies = [
    { id: 1, name: 'BHD',isSelected: false},
    { id: 2, name: 'INR',isSelected: false }
  ];

  filteredData() {
    return this.currencies.filter(c =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editcurrency(currency: any, index: number) {
    const dialogRef = this.dialog.open(CurrencyformComponent, {
      width: '500px',
      disableClose: true,
      data: { currency }   // 👈 pass existing currency to dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.currencies[index] = result; // 👈 update instead of push
      }
    });
  }
  
  deletecurrency(index: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.currencies[index] = result; // 👈 update instead of push
      }
    });
  }

  openAddForm() {
    const dialogRef = this.dialog.open(CurrencyformComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.currencies.push(result);  // add new currency
      }
    });
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.currencies.forEach(currency => currency.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.currencies.every(currency => currency.isSelected);
  }

}


