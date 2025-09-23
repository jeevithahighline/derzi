import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { RoleformComponent } from './roleform/roleform.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';
import { RoleService } from '../../../../core/services/role.service';
import { ToastService } from '../../../../core/services/toastr.service';
import { Router,ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class RolesComponent {
  searchText = '';
  totalItems = 0;
  masterSelected: boolean = false;
  page = 1;
  pageSize = 10;
  pageIndex = 0;
  usertoken:any;
  selectedIds: string[] = [];
  constructor(private _router: Router,private dialog: MatDialog,private _roleService: RoleService,private _toastrService: ToastService) {}
  
  roles: any[] = [];

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(page: number = this.page, size: number = this.pageSize) {
    const token = localStorage.getItem('usertoken'); 
    if (token) {
      this._roleService.getAllRole(token, this.page, this.pageSize).subscribe({
        next: (res: any) => {
          this.roles = res.data.docs || [];
          this.totalItems = res.data.totalDocs || 0;  // backend must return total count
          this.page = res.data.page || page;
          this.pageSize = res.data.limit || size;
        },
        error: (err) => {
          console.error('Error fetching roles', err);
        }
      });
    }
  }

  filteredData() {
    return this.roles.filter(c =>
      c.role.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editrole(role: any, index: number) {
    const dialogRef = this.dialog.open(RoleformComponent, {
      width: '500px',
      disableClose: true,
      data: { role }   // 👈 pass existing currency to dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRoles();
      }
    });
  }

  

  deleterole(data) {

    this.selectedIds = data._id;
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // ✅ Call delete API
        this._roleService.deleteRole(this.selectedIds,this.usertoken).subscribe({
          next: () => {
            this._toastrService.showSuccess("Deleted Successfully");
            this.loadRoles(); // refresh table
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

  openAddForm() {
    const dialogRef = this.dialog.open(RoleformComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRoles();
      }
    });
  }

  deleteSelected(){
    
    const selectedIds = this.roles.filter(item => item.isSelected).map(item => item._id);

    if (selectedIds.length === 0) {
      this._toastrService.showError("Please select at least one record to delete.");
      return;
    }

  }
  // Toggle all checkboxes
  checkUncheckAll() {
    this.roles.forEach(role => role.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.roles.every(role => role.isSelected);
  }

  onPageChange(event: any) {
    this.page = event.pageIndex + 1;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadRoles(this.page, this.pageSize);
  }

}



