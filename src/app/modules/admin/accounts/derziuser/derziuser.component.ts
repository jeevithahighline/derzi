import { Component,Inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toastr.service';

@Component({
  selector: 'app-derziuser',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './derziuser.component.html',
  styleUrl: './derziuser.component.scss'
})

export class DerziuserComponent {
  searchText = '';
  totalItems = 0;
  masterSelected: boolean = false;
  page = 1;
  pageSize = 10;
  pageIndex = 0;
  usertoken:any;
  isSuperAdmin:any;
  selectedIds: string[] = [];
  constructor(private _router: Router,private dialog: MatDialog,private _accountService: AuthService,private _toastrService: ToastService) {}


  derziusers: any[] = [];
  
  ngOnInit(): void {

    this.isSuperAdmin = localStorage.getItem('isSuperAdmin'); 
    this.loadderziusers();
  }

  loadderziusers(page: number = this.page, size: number = this.pageSize) {
    const token = localStorage.getItem('usertoken'); 
    if (token) {
      this._accountService.getAllderziusers(token, this.page, this.pageSize).subscribe({
        next: (res: any) => {
          this.derziusers = res.data.docs || [];
          this.totalItems = res.data.totalDocs || 0;  // backend must return total count
          this.page = res.data.page || page;
          this.pageSize = res.data.limit || size;
        },
        error: (err) => {
          console.error('Error fetching derziusers', err);
        }
      });
    }
  }

  filteredData() {
    return this.derziusers.filter(c =>
      c.firstname.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  

  editderziuser(derziuser: any, index: number) {
    //alert(banner.id);
    this._router.navigate(['/addderziuser', derziuser._id]);   
  }

  deletederziuser(data) {
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
          ? this._accountService.deleteCompleteUser(this.selectedIds, this.usertoken)
          : this._accountService.deleteUser(this.selectedIds, this.usertoken);
  
        deleteObservable.subscribe({
          next: () => {
            this._toastrService.showSuccess("Deleted Successfully");
            this.loadderziusers(); // refresh table
          },
          error: () => {
            this._toastrService.showError("Deletion failed");
          }
        });
      } else {
        this._toastrService.showError("Deletion cancelled by derziuser");
      }
    });
  }
  

  

  addForm(){
    this._router.navigate(['/addderziuser']);
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.derziusers.forEach(derziuser => derziuser.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.derziusers.every(derziuser => derziuser.isSelected);
  }

  onPageChange(event: any) {
    this.page = event.pageIndex + 1;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadderziusers(this.page, this.pageSize);
  }

}
