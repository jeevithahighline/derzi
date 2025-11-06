import { Component,Inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';
import { DriverService } from '../../../../core/services/driver.service';
import { ToastService } from '../../../../core/services/toastr.service';

@Component({
  selector: 'app-drivers',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './drivers.component.html',
  styleUrl: './drivers.component.scss'
})

export class DriversComponent {
  searchText = '';
  totalItems = 0;
  masterSelected: boolean = false;
  page = 1;
  pageSize = 10;
  pageIndex = 0;
  usertoken:any;
  isSuperAdmin:any;
  selectedIds: string[] = [];
  constructor(private _router: Router,private dialog: MatDialog,private _accountService: DriverService,private _toastrService: ToastService) {}


  drivers: any[] = [];
  
  ngOnInit(): void {
    this.isSuperAdmin = localStorage.getItem('isSuperAdmin'); 
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

  

  editdriver(driver: any, index: number) {
    //alert(banner.id);
    this._router.navigate(['/adddriver', driver._id]);   
  }


  deletedriver(data) {
    this.selectedIds = data._id;
  
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const isSuperAdmin = localStorage.getItem('isSuperAdmin') === 'true';
  
        // ✅ Choose which delete API to call
        const deleteObservable = isSuperAdmin
          ? this._accountService.deleteCompleteDriver(this.selectedIds, this.usertoken)
          : this._accountService.deleteDriver(this.selectedIds, this.usertoken);
  
        deleteObservable.subscribe({
          next: () => {
            this._toastrService.showSuccess("Deleted Successfully");
            this.loaddrivers(); // refresh table
          },
          error: () => {
            this._toastrService.showError("Deletion failed");
          }
        });
      } else {
        this._toastrService.showError("Deletion cancelled");
      }
    });
  }

  addForm(){
    this._router.navigate(['/adddriver']);
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.drivers.forEach(driver => driver.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.drivers.every(driver => driver.isSelected);
  }

  deleteSelected() {
    const selectedIds = this.drivers.filter(item => item.isSelected).map(item => item._id);
  
    if (selectedIds.length === 0) {
      this._toastrService.showError("Please select at least one record to delete.");
      return;
    }
  
    // ✅ Confirmation popup
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // ✅ Prepare request body
        const requestBody = { deleteIds: selectedIds };
  
        // ✅ Call multi-delete API
        this._accountService.deleteMultipleData(requestBody, this.usertoken).subscribe({
          next: () => {
            this._toastrService.showSuccess("Selected drivers deleted successfully");
            this.loaddrivers(); // refresh table
          },
          error: () => {
            this._toastrService.showError("Failed to delete selected drivers");
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
    this.loaddrivers(this.page, this.pageSize);
  }

}