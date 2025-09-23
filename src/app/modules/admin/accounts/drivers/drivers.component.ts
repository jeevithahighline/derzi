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
  selectedIds: string[] = [];
  constructor(private _router: Router,private dialog: MatDialog,private _accountService: DriverService,private _toastrService: ToastService) {}


  drivers: any[] = [];
  
  ngOnInit(): void {
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
    this._router.navigate(['/adddriver', driver.id]);   
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
        // ✅ Call delete API
        this._accountService.deleteDriver(this.selectedIds,this.usertoken).subscribe({
          next: () => {
            this._toastrService.showSuccess("Deleted Successfully");
            this.loaddrivers(); // refresh table
          },
          error: () => {
            this._toastrService.showError("Deletion failed");
          }
        });
      } else {
        this._toastrService.showError("Deletion cancelled by driver");
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

}