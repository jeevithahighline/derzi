import { Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class InvoicesComponent {
  searchText = '';

  invoices = [
    { invoiceNo: 'INV5001', orderId: 'ORD1001', customer: 'John Doe', date: '2025-08-18', total: 1200, status: 'Paid' },
    { invoiceNo: 'INV5002', orderId: 'ORD1002', customer: 'Jane Smith', date: '2025-08-19', total: 2500, status: 'Unpaid' },
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
}

