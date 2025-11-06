import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OrderService } from '../../../../core/services/order.service';
import { ToastService } from '../../../../core/services/toastr.service';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-allorders',
  templateUrl: './allorders.component.html',
  styleUrls: ['./allorders.component.scss'],
  imports: [MATERIAL_IMPORTS]   // ✅ just one line

})
export class AllordersComponent {
  // 🔍 Filters & Search
  searchText: string = '';
  selectedStatus: string = '';
  amount: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;

  // 📋 Pagination & Selection
  masterSelected: boolean = false;
  totalItems = 0;
  page = 1;
  pageSize = 10;
  pageIndex = 0;
  selectedIds: string[] = [];

  // 🧩 Data
  usertoken: any;
  orders: any[] = [];

  // 🕒 Debounce search input
  searchTextChanged = new Subject<string>();

  constructor(
    private _router: Router,
    private dialog: MatDialog,
    private _orderService: OrderService,
    private _toastrService: ToastService
  ) {}

  ngOnInit(): void {
    this.usertoken = localStorage.getItem('usertoken');
    this.loadOrders();

    // Debounce search for smooth typing
    this.searchTextChanged
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.page = 1;
        this.applyFilters();
      });
  }

  // ✅ Load default orders
  loadOrders(page: number = this.page, size: number = this.pageSize) {
    const token = localStorage.getItem('usertoken');
    if (token) {
      this._orderService.getAllOrder(token, this.page, this.pageSize).subscribe({
        next: (res: any) => {
          this.orders = res.data.docs || [];
          this.totalItems = res.data.totalDocs || 0;
          this.page = res.data.page || page;
          this.pageSize = res.data.limit || size;
        },
        error: (err) => {
          console.error('Error fetching orders', err);
        },
      });
    }
  }

  // ✅ Called when typing in search box
  onSearchChange() {
    this.searchTextChanged.next(this.searchText);
  }

  // ✅ Apply filters (including search)
  applyFilters() {
    const filters: any = {};

    if (this.searchText) filters.search = this.searchText;
    if (this.selectedStatus) filters.order_status = this.selectedStatus;
    if (this.amount) filters.amount = this.amount;
    if (this.startDate) filters.startDate = this.startDate.toISOString();
    if (this.endDate) filters.endDate = this.endDate.toISOString();

    this._orderService
      .listallOrder(this.usertoken, this.page, this.pageSize, filters)
      .subscribe({
        next: (res) => {
          this.orders = res.data.docs || [];
          this.totalItems = res.data.totalDocs || 0;
        },
        error: (err) => {
          console.error('❌ Failed to load filtered orders:', err);
        },
      });
  }

  clearFilters() {
    this.searchText = '';
    this.selectedStatus = '';
    this.amount = '';
    this.startDate = null;
    this.endDate = null;
    this.loadOrders();
  }

  // ✅ Getter for filtered orders (for template)
  get filteredOrders() {
    return this.orders;
  }

  // ✅ Delete Order
  deleteOrder(data: any) {
    this.selectedIds = data;
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._orderService.deleteOrder(this.selectedIds, this.usertoken).subscribe({
          next: () => {
            this._toastrService.showSuccess('Deleted Successfully');
            this.loadOrders();
          },
          error: () => {
            this._toastrService.showError('Deletion failed');
          },
        });
      } else {
        this._toastrService.showError('Deletion cancelled by user');
      }
    });
  }

  // ✅ Pagination
  onPageChange(event: any) {
    this.page = event.pageIndex + 1;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilters();
  }

  // ✅ View Order
  viewOrder(orderId: string) {
    this._router.navigate(['/detailorder', orderId]);
  }

  // ✅ Create Order
  addOrder() {
    this._router.navigate(['/manualorder']);
  }

  // ✅ Checkbox helpers
  checkUncheckAll() {
    this.orders.forEach((order) => (order.isSelected = this.masterSelected));
  }

  isAllSelected() {
    this.masterSelected = this.orders.every((order) => order.isSelected);
  }
}
