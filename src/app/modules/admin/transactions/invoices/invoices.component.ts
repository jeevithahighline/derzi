import { Component,Inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class InvoicesComponent {
  searchText: string = '';
  selectedStatus: string = '';
  amount: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  masterSelected: boolean = false;
  totalItems = 2;
  invoices = [
    { invoiceNo: 'INV5001', orderId: 'ORD1001', customer: 'John Doe', date: '2025-08-18', total: 1200, status: 'Paid', isSelected: false },
    { invoiceNo: 'INV5002', orderId: 'ORD1002', customer: 'Jane Smith', date: '2025-08-19', total: 2500, status: 'Unpaid', isSelected: false },
  ];

  filteredInvoices() {
    return this.invoices.filter(i =>
      i.customer.toLowerCase().includes(this.searchText.toLowerCase()) ||
      i.invoiceNo.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  viewInvoice(invoice: any) {
    alert(`Viewing Invoice ${invoice.invoiceNo}`);
  }

  deleteInvoice(invoice: any) {
    alert(`Deleting Invoice ${invoice.invoiceNo}`);
  }

  applyFilters() {
    console.log({
      search: this.searchText,
      status: this.selectedStatus,
      amount: this.amount,
      start: this.startDate,
      end: this.endDate
    });

    // Call API or filter logic here
  }

  clearFilters() {
    this.searchText = '';
    this.selectedStatus = '';
    this.amount='';
    this.startDate = null;
    this.endDate = null;
  }

   // Toggle all checkboxes
  checkUncheckAll() {
    this.invoices.forEach(country => country.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.invoices.every(country => country.isSelected);
  } 
}

