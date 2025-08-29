import { Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
@Component({
  selector: 'app-allorders',
  templateUrl: './allorders.component.html',
  styleUrls: ['./allorders.component.scss'],
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class AllordersComponent {
  
  searchText: string = '';
  selectedStatus: string = '';
  customerName: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;

  totalItems = 2;
  orders = [
    { id: 'ORD1001', customer: 'John Doe', date: new Date('2025-08-28'), amount: 1200, status: 'Pending' },
    { id: 'ORD1002', customer: 'Jane Smith', date: new Date('2025-08-28'), amount: 2500, status: 'Completed' },
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

  applyFilters() {
    console.log({
      search: this.searchText,
      status: this.selectedStatus,
      customer: this.customerName,
      start: this.startDate,
      end: this.endDate
    });
    // Call API or filter logic here
  }

  clearFilters() {
    this.searchText = '';
    this.selectedStatus = '';
    this.customerName = '';
    this.startDate = null;
    this.endDate = null;
  }


}

