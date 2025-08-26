import { Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
@Component({
  selector: 'app-ordersreport',
  templateUrl: './ordersreport.component.html',
  styleUrls: ['./ordersreport.component.scss'],
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class OrdersreportComponent {
  searchText = '';
  totalItems = 2;
  orders = [
    { id: 'ORD1001', customer: 'John Doe', date: '2025-08-18', amount: 1200, status: 'Pending' },
    { id: 'ORD1002', customer: 'Jane Smith', date: '2025-08-19', amount: 2500, status: 'Completed' },
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
}


