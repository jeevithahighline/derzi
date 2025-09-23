import { Component,Inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { MatDialog } from '@angular/material/dialog';
import { FabricformComponent } from './fabricform/fabricform.component';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';
import { FabricService } from '../../../../core/services/fabric.service';
import { ToastService } from '../../../../core/services/toastr.service';


@Component({
  selector: 'app-fabric',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './fabric.component.html',
  styleUrl: './fabric.component.scss'
})

export class FabricComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;
  page = 1;
  pageSize = 10;
  pageIndex = 0;
  usertoken:any;
  selectedIds: string[] = [];
  constructor(private dialog: MatDialog,private _masterservice: FabricService,private _toastrService: ToastService) {}

  fabrics: any[] = [];

  ngOnInit(): void {
    this.loadFabric();
  }

  loadFabric(page: number = this.page, size: number = this.pageSize) {
    const token = localStorage.getItem('usertoken'); 
    if (token) {
      this._masterservice.getAllFabric(token, this.page, this.pageSize).subscribe({
        next: (res: any) => {
          this.fabrics = res.data.docs || [];
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
    return this.fabrics.filter(c =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editfabric(fabric: any, index: number) {

    //alert(banner.id);
    const dialogRef = this.dialog.open(FabricformComponent, {
      width: '500px',
      disableClose: true,
      data: { fabric }   // 👈 pass existing banner to dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadFabric();
      }
    });
  }  

  openAddForm() {
    const dialogRef = this.dialog.open(FabricformComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadFabric();
      }
    });
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.fabrics.forEach(fabric => fabric.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.fabrics.every(fabric => fabric.isSelected);
  }

  deletefabric(data) {

    this.selectedIds = data._id;
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // ✅ Call delete API
        this._masterservice.deleteFabric(this.selectedIds,this.usertoken).subscribe({
          next: () => {
            this._toastrService.showSuccess("Deleted Successfully");
            this.loadFabric(); // refresh table
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
    this.loadFabric(this.page, this.pageSize);
  }

}

