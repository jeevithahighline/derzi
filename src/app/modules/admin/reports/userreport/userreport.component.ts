import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { ToastService } from '../../../../core/services/toastr.service';
import { ExportService } from '../../../../core/services/export.service';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-userreport',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './userreport.component.html',
  styleUrl: './userreport.component.scss'
})

export class UserreportComponent {
  searchText = '';
  totalItems = 0;
  masterSelected: boolean = false;
  page = 1;
  pageSize = 10;
  pageIndex = 0;
  usertoken:any;
  selectedIds: string[] = [];

  constructor(private _router: Router,private _accountService: UserService,private _toastrService: ToastService,private _exportService: ExportService) {}
  
  users: any[] = [];
  
  ngOnInit(): void {
    this.usertoken = localStorage.getItem('usertoken'); // get token
    this.loadUsers();
  }

  loadUsers(page: number = this.page, size: number = this.pageSize) {
    const token = localStorage.getItem('usertoken'); 
    if (token) {
      this._accountService.getAllUsers(token, this.page, this.pageSize).subscribe({
        next: (res: any) => {
          this.users = res.data.docs || [];
          this.totalItems = res.data.totalDocs || 0;  // backend must return total count
          this.page = res.data.page || page;
          this.pageSize = res.data.limit || size;
        },
        error: (err) => {
          console.error('Error fetching users', err);
        }
      });
    }
  }

  filteredData() {
    return this.users.filter(c =>
      c.firstname.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // ✅ Download only one driver as CSV
  downloadData(user: any) {
    const csvData = [
      ['User ID', 'First Name', 'Last Name', 'Email', 'Mobile Number', 'Status'],
      [
        user.userCode,
        user.firstname,
        user.lastname,
        user.email,
        user.mobilenumber,
        user.status ? 'Active' : 'In-Active'
      ]
    ];

    const csvContent = csvData.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `User_${user.userCode}.csv`);
  }


  // Toggle all checkboxes
  checkUncheckAll() {
    this.users.forEach(country => country.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.users.every(country => country.isSelected);
  }

  downloadCsv() {
    this._exportService.ExportUserCsv(this.usertoken, 1, 100).subscribe((data: Blob) => {
      this.downloadFile(data, 'users.csv');
    });
  }
  
  downloadExcel() {
    this._exportService.ExportUserExcel(this.usertoken, 1, 100).subscribe((data: Blob) => {
      this.downloadFile(data, 'users.xlsx');
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
    this.loadUsers(this.page, this.pageSize);
  }
  

}


