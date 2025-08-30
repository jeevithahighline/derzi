import { Component,Inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
@Component({
  selector: 'app-ordersreport',
  templateUrl: './ordersreport.component.html',
  styleUrls: ['./ordersreport.component.scss'],
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class OrdersreportComponent {
  searchText: string = '';
  selectedStatus: string = '';
  amount: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  masterSelected: boolean = false;
  totalItems = 2;

  orders = [
    { id: 'ORD1001', customer: 'John Doe', date: '2025-08-18', amount: 1200, status: 'Pending',isSelected: false },
    { id: 'ORD1002', customer: 'Jane Smith', date: '2025-08-19', amount: 2500, status: 'Completed',isSelected: false },
  ];

  filteredOrders() {
    return this.orders.filter(o =>
      o.customer.toLowerCase().includes(this.searchText.toLowerCase()) ||
      o.id.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editOrder(order: any) {
    alert(`Editing Order ${order.id}`);
  }

  deleteOrder(order: any) {
    alert(`Deleting Order ${order.id}`);
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.orders.forEach(country => country.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.orders.every(country => country.isSelected);
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
}


