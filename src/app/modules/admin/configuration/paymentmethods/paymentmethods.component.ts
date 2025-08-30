import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { MatDialog } from '@angular/material/dialog';
import { PaymentmethodformComponent } from './paymentmethodform/paymentmethodform.component';

@Component({
  selector: 'app-paymentmethods',
  templateUrl: './paymentmethods.component.html',
  styleUrl: './paymentmethods.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class PaymentmethodsComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;
  constructor(private dialog: MatDialog) {}

  payments = [
    { id: 1, name: 'COD',isSelected: false},
    { id: 2, name: 'Netbanking',isSelected: false },
    { id: 3, name: 'Credit Card',isSelected: false }
  ];

  filteredData() {
    return this.payments.filter(c =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editpayment(payment: any, index: number) {
    const dialogRef = this.dialog.open(PaymentmethodformComponent, {
      width: '500px',
      disableClose: true,
      data: { payment }   // 👈 pass existing payment to dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.payments[index] = result; // 👈 update instead of push
      }
    });
  }
  
  deletepayment(payment: any) {
    //alert(`Deleting ${payment.name}`);
  }

  openAddForm() {
    const dialogRef = this.dialog.open(PaymentmethodformComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.payments.push(result);  // add new payment
      }
    });
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.payments.forEach(payment => payment.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.payments.every(payment => payment.isSelected);
  }

}



