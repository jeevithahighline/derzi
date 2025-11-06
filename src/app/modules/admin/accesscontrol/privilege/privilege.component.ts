import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';
import { PrivilegeService } from '../../../../core/services/privilege.service';
import { ToastService } from '../../../../core/services/toastr.service';

@Component({
  selector: 'app-privilege',
  templateUrl: './privilege.component.html',
  styleUrl: './privilege.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class PrivilegeComponent {
  searchText = '';
  totalItems = 0;
  masterSelected: boolean = false;
  page = 1;
  pageSize = 10;
  pageIndex = 0;
  usertoken:any;
  selectedIds: string[] = [];

  constructor(private _router: Router,private dialog: MatDialog,private _pageService: PrivilegeService,private _toastrService: ToastService) {}
  privileges: any[] = [];

  ngOnInit(): void {
    this.loadPrivileges();
  }

  loadPrivileges(page: number = this.page, size: number = this.pageSize) {
    const token = localStorage.getItem('usertoken'); 
    if (token) {
      this._pageService.getAllPrivilege(token, this.page, this.pageSize).subscribe({
        next: (res: any) => {
          this.privileges = res.data.docs || [];
          this.totalItems = res.data.totalDocs || 0;  // backend must return total count
          this.page = res.data.page || page;
          this.pageSize = res.data.limit || size;
        },
        error: (err) => {
          console.error('Error fetching privileges', err);
        }
      });
    }
  }

  filteredData() {
    return this.privileges.filter(c =>
      c.privilegename.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

 

  editprivilege(page: any, index: number) {
    //alert(banner.id);
    this._router.navigate(['/addprivileges', page._id]);   
  }


  deleteprivilege(data) {

    this.selectedIds = data._id;
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // ✅ Call delete API
        this._pageService.deletePrivilege(this.selectedIds,this.usertoken).subscribe({
          next: () => {
            this._toastrService.showSuccess("Deleted Successfully");
            this.loadPrivileges(); // refresh table
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

  deleteSelected() {
    const selectedIds = this.privileges.filter(item => item.isSelected).map(item => item._id);
  
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
        this._pageService.deleteMultipleData(requestBody, this.usertoken).subscribe({
          next: () => {
            this._toastrService.showSuccess("Selected privilege deleted successfully");
            this.loadPrivileges(); // refresh table
          },
          error: () => {
            this._toastrService.showError("Failed to delete selected privilege");
          }
        });
      } else {
        this._toastrService.showError("Deletion cancelled by user");
      }
    });
  }

  openAddForm(){
    this._router.navigate(['/addprivileges']);
  }

   // Toggle all checkboxes
   checkUncheckAll() {
    this.privileges.forEach(Page => Page.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.privileges.every(Page => Page.isSelected);
  }

  onPageChange(event: any) {
    this.page = event.pageIndex + 1;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPrivileges(this.page, this.pageSize);
  }

}







