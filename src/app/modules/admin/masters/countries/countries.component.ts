import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { CountryformComponent } from './countryform/countryform.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';
import { CountryService } from '../../../../core/services/country.service';
import { ToastService } from '../../../../core/services/toastr.service';


@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class CountriesComponent {
  searchText = '';
  totalItems =0;
  masterSelected: boolean = false;
  constructor(private dialog: MatDialog,private _masterservice: CountryService,private _toastrService: ToastService) {}
  countries: any[] = [];
  selectedIds: string[] = [];
  usertoken:any;
  page = 1;
  pageSize = 10;
  pageIndex = 0;

  ngOnInit(): void {
    //this._toastrService.showSuccess("hello");
    this.usertoken = localStorage.getItem('usertoken'); 
    this.loadCountries();
  }

  loadCountries(page: number = this.page, size: number = this.pageSize) {
    const token = localStorage.getItem('usertoken'); 
    if (token) {
      this._masterservice.getAllCountry(token, this.page, this.pageSize).subscribe({
        next: (res: any) => {
          this.countries = res.data.docs || [];
          this.totalItems = res.data.totalDocs || 0;  // backend must return total count
          this.page = res.data.page || page;
          this.pageSize = res.data.limit || size;
        },
        error: (err) => {
          console.error('Error fetching countries', err);
        }
      });
    }
  }
   

  filteredData() {
    return this.countries.filter(c =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editCountry(country: any, index: number) {
    const dialogRef = this.dialog.open(CountryformComponent, {
      width: '500px',
      disableClose: true,
      data: { 
        country, 
        isEditMode: true   // 👈 flag for edit
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCountries();
      }
    });
  }
  
 

  deleteCountry(data) {

    this.selectedIds = data._id;
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // ✅ Call delete API
        this._masterservice.deleteCountry(this.selectedIds,this.usertoken).subscribe({
          next: () => {
            this._toastrService.showSuccess("Deleted Successfully");
            this.loadCountries(); // refresh table
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
  
  openAddCountry() {
    const dialogRef = this.dialog.open(CountryformComponent, {
      width: '500px',
      disableClose: true,
      data: { isEditMode: false }  // 👈 flag for add
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCountries();
      }
    });
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.countries.forEach(country => country.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.countries.every(country => country.isSelected);
  }

  deleteSelected() {
    const selectedIds = this.countries.filter(item => item.isSelected).map(item => item._id);
  
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
        this._masterservice.deleteMultipleData(requestBody, this.usertoken).subscribe({
          next: () => {
            this._toastrService.showSuccess("Selected countries deleted successfully");
            this.loadCountries(); // refresh table
          },
          error: () => {
            this._toastrService.showError("Failed to delete selected countries");
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
    this.loadCountries(this.page, this.pageSize);
  }

  
}

