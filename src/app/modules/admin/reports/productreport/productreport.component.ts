import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { ToastService } from '../../../../core/services/toastr.service';
import { ExportService } from '../../../../core/services/export.service';
import { environment } from '../../../../../environments/environment';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-productreport',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './productreport.component.html',
  styleUrl: './productreport.component.scss'
})

export class ProductreportComponent {
  searchText = '';
  totalItems = 0;
  masterSelected: boolean = false;
  page = 1;
  pageSize = 10;
  pageIndex = 0;
  usertoken:any;
  selectedIds: string[] = [];
  backendUrl = environment.backendurlImages;
  constructor(private _router: Router,private _accountService: ProductService,private _toastrService: ToastService,private _exportService: ExportService) {}

  products: any[] = [];

  ngOnInit(): void {
    this.usertoken = localStorage.getItem('usertoken'); // get token
    this.loadProducts();
  }

  filteredData() {
    return this.products.filter(c =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.products.forEach(country => country.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.products.every(country => country.isSelected);
  }

  downloadCsv() {
    this._exportService.ExportProductCsv(this.usertoken, 1, 100).subscribe((data: Blob) => {
      this.downloadFile(data, 'products.csv');
    });
  }
  
  downloadExcel() {
    this._exportService.ExportProductExcel(this.usertoken, 1, 100).subscribe((data: Blob) => {
      this.downloadFile(data, 'products.xlsx');
    });
  }

  loadProducts(page: number = this.page, size: number = this.pageSize) {
    const token = localStorage.getItem('usertoken'); 
    if (token) {
      this._accountService.getAllProduct(token, this.page, this.pageSize).subscribe({
        next: (res: any) => {
          this.products = res.data.products || [];
          this.totalItems = res.data.products.length || 0;  // backend must return total count
          this.page = res.data.page || page;
          this.pageSize = res.data.limit || size;
        },
        error: (err) => {
          console.error('Error fetching brand', err);
        }
      });
    }
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
    this.loadProducts(this.page, this.pageSize);
  }

}


