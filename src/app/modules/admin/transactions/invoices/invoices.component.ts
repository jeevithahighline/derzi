import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { OrderService } from '../../../../core/services/order.service';
import { ToastService } from '../../../../core/services/toastr.service';
import { MATERIAL_IMPORTS } from '../../../material.import';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
  imports: [MATERIAL_IMPORTS],
})
export class InvoicesComponent {
  // 🔍 Filters & Search
  searchText: string = '';
  selectedStatus: string = '';
  selectedmethod: string = '';
  customerName: string = '';
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
  invoices: any[] = [];
  amount: string = '';

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
    this.loadInvoices();

    // 🔄 Debounce search for smoother typing
    this.searchTextChanged
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.page = 1;
        this.applyFilters();
      });
  }

  // ✅ Load default invoices
  loadInvoices(page: number = this.page, size: number = this.pageSize) {
    const token = localStorage.getItem('usertoken');
    if (token) {
      this._orderService.getAllInvoices(token, page, size).subscribe({
        next: (res: any) => {
          this.invoices = res.data.docs || [];
          this.totalItems = res.data.totalDocs || 0;
          this.page = res.data.page || page;
          this.pageSize = res.data.limit || size;
        },
        error: (err) => {
          console.error('Error fetching invoices', err);
        },
      });
    }
  }

  // ✅ Called when typing in search box
  onSearchChange() {
    this.searchTextChanged.next(this.searchText);
  }

  // ✅ Apply filters
  applyFilters() {
    const filters: any = {};
    if (this.searchText) filters.search = this.searchText;
    if (this.selectedStatus) filters.status = this.selectedStatus;
    if (this.selectedmethod) filters.method = this.selectedmethod;
    if (this.customerName) filters.customer = this.customerName;
    if (this.startDate) filters.startDate = this.startDate.toISOString();
    if (this.endDate) filters.endDate = this.endDate.toISOString();

    this._orderService.listAllInvoices(this.usertoken, this.page, this.pageSize, filters).subscribe({
      next: (res) => {
        this.invoices = res.data.docs || [];
        this.totalItems = res.data.totalDocs || 0;
      },
      error: (err) => {
        console.error('❌ Failed to load filtered invoices:', err);
      },
    });
  }

  clearFilters() {
    this.searchText = '';
    this.selectedStatus = '';
    this.selectedmethod = '';
    this.customerName = '';
    this.startDate = null;
    this.endDate = null;
    this.loadInvoices();
  }

  // ✅ Getter for filtered list
  get filteredInvoices() {
    return this.invoices;
  }

  // ✅ View invoice
  viewOrder(orderId: string, invoiceId: string) {
    this._router.navigate(['/detailinvoice'], {
      queryParams: { orderId, invoiceId },
    });
  }

  // ✅ Pagination
  onPageChange(event: any) {
    this.page = event.pageIndex + 1;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilters();
  }

  // ✅ Checkbox helpers
  checkUncheckAll() {
    this.invoices.forEach((invoice) => (invoice.isSelected = this.masterSelected));
  }

  isAllSelected() {
    this.masterSelected = this.invoices.every((invoice) => invoice.isSelected);
  }
}
