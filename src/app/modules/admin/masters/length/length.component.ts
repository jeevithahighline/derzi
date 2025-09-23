import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { MatDialog } from '@angular/material/dialog';
import { LengthformComponent } from './lengthform/lengthform.component';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';
import { LengthService } from '../../../../core/services/length.service';
import { ToastService } from '../../../../core/services/toastr.service';

@Component({
  selector: 'app-length',
  templateUrl: './length.component.html',
  styleUrl: './length.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class LengthComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;
  page = 1;
  pageSize = 10;
  pageIndex = 0;
  usertoken:any;
  selectedIds: string[] = [];
  constructor(private dialog: MatDialog,private _masterservice: LengthService,private _toastrService: ToastService) {}
  

  lengths: any[] = [];

  ngOnInit(): void {
    this.loadLength();
  }

  loadLength(page: number = this.page, size: number = this.pageSize) {
    const token = localStorage.getItem('usertoken'); 
    if (token) {
      this._masterservice.getAllLength(token, this.page, this.pageSize).subscribe({
        next: (res: any) => {
          this.lengths = res.data.docs || [];
          this.totalItems = res.data.totalDocs || 0;  // backend must return total count
          this.page = res.data.page || page;
          this.pageSize = res.data.limit || size;
        },
        error: (err) => {
          console.error('Error fetching brand', err);
        }
      });
    }
  }

  filteredData() {
    return this.lengths.filter(c =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editlength(length: any, index: number) {

    //alert(banner.id);
    const dialogRef = this.dialog.open(LengthformComponent, {
      width: '500px',
      disableClose: true,
      data: { length }   // 👈 pass existing banner to dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadLength();
      }
    });
  }

  openAddForm() {
    const dialogRef = this.dialog.open(LengthformComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadLength();
      }
    });
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.lengths.forEach(length => length.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.lengths.every(length => length.isSelected);
  }

  deletelength(data) {

    this.selectedIds = data._id;
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // ✅ Call delete API
        this._masterservice.deleteLength(this.selectedIds,this.usertoken).subscribe({
          next: () => {
            this._toastrService.showSuccess("Deleted Successfully");
            this.loadLength(); // refresh table
          },
          error: () => {
            this._toastrService.showError("Deletion failed");
          }
        });
      } else {
        this._toastrService.showError("Deletion cancelled by user");
      }
    });
  }

  onPageChange(event: any) {
    this.page = event.pageIndex + 1;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadLength(this.page, this.pageSize);
  }

}


