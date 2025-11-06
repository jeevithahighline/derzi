import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';
import { MerchantService } from '../../../../core/services/merchant.service';
import { ToastService } from '../../../../core/services/toastr.service';
import { ExportService } from '../../../../core/services/export.service';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-merchantreport',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './merchantreport.component.html',
  styleUrl: './merchantreport.component.scss'
})

export class MerchantreportComponent {
  searchText = '';
  totalItems = 0;
  masterSelected: boolean = false;
  page = 1;
  pageSize = 10;
  pageIndex = 0;
  usertoken:any;
  selectedIds: string[] = [];

  constructor(private _router: Router,private _accountService: MerchantService,private _toastrService: ToastService,private _exportService: ExportService) {}
  
  merchants: any[] = [];
  
  ngOnInit(): void {
    this.usertoken = localStorage.getItem('usertoken'); // get token
    this.loadmerchants();
  }

  loadmerchants(page: number = this.page, size: number = this.pageSize) {
    const token = localStorage.getItem('usertoken'); 
    if (token) {
      this._accountService.getAllMerchant(token, this.page, this.pageSize).subscribe({
        next: (res: any) => {
          this.merchants = res.data.docs || [];
          this.totalItems = res.data.totalDocs || 0;  // backend must return total count
          this.page = res.data.page || page;
          this.pageSize = res.data.limit || size;
        },
        error: (err) => {
          console.error('Error fetching merchants', err);
        }
      });
    }
  }

  filteredData() {
    return this.merchants.filter(c =>
      c.firstname.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // ✅ Download only one driver as CSV
  downloadData(merchant: any) {
    const csvData = [
      ['Merchant ID', 'First Name', 'Last Name', 'Email', 'Mobile Number', 'Status'],
      [
        merchant.merchantCode,
        merchant.firstname,
        merchant.lastname,
        merchant.email,
        merchant.mobilenumber,
        merchant.status ? 'Active' : 'In-Active'
      ]
    ];

    const csvContent = csvData.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `Merchant_${merchant.merchantCode}.csv`);
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.merchants.forEach(country => country.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.merchants.every(country => country.isSelected);
  }

  downloadmerchantsCsv() {
    this._exportService.ExportMerchantCsv(this.usertoken, 1, 100).subscribe((data: Blob) => {
      this.downloadFile(data, 'merchants.csv');
    });
  }
  
  downloadmerchantsExcel() {
    this._exportService.ExportMerchantExcel(this.usertoken, 1, 100).subscribe((data: Blob) => {
      this.downloadFile(data, 'merchants.xlsx');
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

  onPageChange(event: any) {
    this.page = event.pageIndex + 1;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadmerchants(this.page, this.pageSize);
  }
  

}



