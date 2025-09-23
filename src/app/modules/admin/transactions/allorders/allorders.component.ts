import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OrderService } from '../../../../core/services/order.service';
import { ToastService } from '../../../../core/services/toastr.service';
@Component({
  selector: 'app-allorders',
  templateUrl: './allorders.component.html',
  styleUrls: ['./allorders.component.scss'],
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})

export class AllordersComponent {
  
  searchText: string = '';
  selectedStatus: string = '';
  amount: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  masterSelected: boolean = false;
  totalItems = 0;
  page = 1;
  pageSize = 10;
  pageIndex = 0;
  usertoken:any;
  selectedIds: string[] = [];


  constructor(private _router: Router,private dialog: MatDialog,private _orderService: OrderService,private _toastrService: ToastService) {}

  orders: any[] = [];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(page: number = this.page, size: number = this.pageSize) {
    const token = localStorage.getItem('usertoken'); 
    if (token) {
      this._orderService.getAllOrder(token, this.page, this.pageSize).subscribe({
        next: (res: any) => {
          this.orders = res.data.docs || [];
          this.totalItems = res.data.totalDocs || 0;  // backend must return total count
          this.page = res.data.page || page;
          this.pageSize = res.data.limit || size;
        },
        error: (err) => {
          console.error('Error fetching orders', err);
        }
      });
    }
  }


  filteredOrders() {
    //console.log("sdsdsdsd",this.orders);
    return this.orders;
  }

  viewOrder(orderId: string) {
    this._router.navigate(['/detailorder', orderId]);
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
    this.orders.forEach(country => country.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.orders.every(country => country.isSelected);
  }


}

