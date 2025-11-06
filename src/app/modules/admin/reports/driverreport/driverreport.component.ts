import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';
import { DriverService } from '../../../../core/services/driver.service';
import { ToastService } from '../../../../core/services/toastr.service';
import { ExportService } from '../../../../core/services/export.service';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-driverreport',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './driverreport.component.html',
  styleUrl: './driverreport.component.scss'
})

export class DriverreportComponent {
  searchText = '';
  totalItems = 0;
  masterSelected: boolean = false;
  page = 1;
  pageSize = 10;
  pageIndex = 0;
  usertoken:any;
  selectedIds: string[] = [];

  constructor(private _router: Router,private _accountService: DriverService,private _toastrService: ToastService,private _exportService: ExportService) {}
  
  drivers: any[] = [];
  
  ngOnInit(): void {
    this.usertoken = localStorage.getItem('usertoken'); // get token
    this.loaddrivers();
  }

  loaddrivers(page: number = this.page, size: number = this.pageSize) {
    const token = localStorage.getItem('usertoken'); 
    if (token) {
      this._accountService.getAllDriver(token, this.page, this.pageSize).subscribe({
        next: (res: any) => {
          this.drivers = res.data.docs || [];
          this.totalItems = res.data.totalDocs || 0;  // backend must return total count
          this.page = res.data.page || page;
          this.pageSize = res.data.limit || size;
        },
        error: (err) => {
          console.error('Error fetching drivers', err);
        }
      });
    }
  }

  filteredData() {
    return this.drivers.filter(c =>
      c.firstname.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.drivers.forEach(country => country.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.drivers.every(country => country.isSelected);
  }

  downloadDriverCsv() {
    this._exportService.ExportDriverCsv(this.usertoken, 1, 100).subscribe((data: Blob) => {
      this.downloadFile(data, 'drivers.csv');
    });
  }
  
  downloadDriverExcel() {
    this._exportService.ExportDriverExcel(this.usertoken, 1, 100).subscribe((data: Blob) => {
      this.downloadFile(data, 'drivers.xlsx');
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

  // ✅ Download only one driver as CSV
  downloadData(driver: any) {
    const csvData = [
      ['Driver ID', 'First Name', 'Last Name', 'Email', 'Mobile Number', 'Status'],
      [
        driver.driverCode,
        driver.firstname,
        driver.lastname,
        driver.email,
        driver.mobilenumber,
        driver.status ? 'Active' : 'In-Active'
      ]
    ];

    const csvContent = csvData.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `Driver_${driver.driverCode}.csv`);
  }

  onPageChange(event: any) {
    this.page = event.pageIndex + 1;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loaddrivers(this.page, this.pageSize);
  }
  

}


