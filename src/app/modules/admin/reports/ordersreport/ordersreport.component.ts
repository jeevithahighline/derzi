import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { ToastService } from '../../../../core/services/toastr.service';
import { ExportService } from '../../../../core/services/export.service';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-ordersreport',
  templateUrl: './ordersreport.component.html',
  styleUrls: ['./ordersreport.component.scss'],
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})

export class OrdersreportComponent {
  searchText = '';
  totalItems = 0;
  masterSelected: boolean = false;
  page = 1;
  pageSize = 10;
  pageIndex = 0;
  usertoken:any;
  selectedIds: string[] = [];
  selectedStatus: string = '';
  amount: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  constructor(private _router: Router,private _accountService: OrderService,private _toastrService: ToastService,private _exportService: ExportService) {}
  
  orders: any[] = [];
  
  ngOnInit(): void {
    this.usertoken = localStorage.getItem('usertoken'); // get token
    this.loadOrders();
  }

  loadOrders(page: number = this.page, size: number = this.pageSize) {
    const token = localStorage.getItem('usertoken'); 
    if (token) {
      this._accountService.getAllOrder(token, this.page, this.pageSize).subscribe({
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

  filteredData() {
    return this.orders.filter(c =>
      c.orderStatus.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.orders.forEach(country => country.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.orders.every(country => country.isSelected);
  }

  downloadCsv() {
    this._exportService.ExportOrderCsv(this.usertoken, 1, 100).subscribe((data: Blob) => {
      this.downloadFile(data, 'orders.csv');
    });
  }
  
  downloadExcel() {
    this._exportService.ExportOrderExcel(this.usertoken, 1, 100).subscribe((data: Blob) => {
      this.downloadFile(data, 'orders.xlsx');
    });
  }
  
  private downloadFile(data: Blob, filename: string) {
    const blob = new Blob([data], { type: data.type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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

  onPageChange(event: any) {
    this.page = event.pageIndex + 1;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadOrders(this.page, this.pageSize);
  }

}




