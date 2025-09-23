import { Component,Inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { FormBuilder, FormGroup, Validators,FormArray } from '@angular/forms';
import { Router,ActivatedRoute  } from '@angular/router';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PromocodeService } from '../../../../core/services/promocode.service';
import { ToastService } from '../../../../core/services/toastr.service';
@Component({
  selector: 'app-promocode',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './promocode.component.html',
  styleUrl: './promocode.component.scss'
})

export class PromocodeComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;
  page = 1;
  pageSize = 10;
  pageIndex = 0;
  usertoken:any;
  selectedIds: string[] = [];
  constructor(private _router: Router,private route: ActivatedRoute,private fb: FormBuilder,private dialog: MatDialog,private _promocodeservice:PromocodeService,private _toastrService: ToastService) {}



  promocode: any[] = [];

  ngOnInit(): void {
    this.loadPromocode();
  }

  loadPromocode(page: number = this.page, size: number = this.pageSize) {
    const token = localStorage.getItem('usertoken'); 
    if (token) {
      this._promocodeservice.getAllPromocode(token, this.page, this.pageSize).subscribe({
        next: (res: any) => {
          this.promocode = res.data.docs || [];
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
    return this.promocode.filter(c =>
      c.code.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editpromocode(promocode: any, index: number) {
    this._router.navigate(['/addpromocode', promocode._id]);
  }


  addPromocode(){
    this._router.navigate(['/addpromocode']);
  }

   // Toggle all checkboxes
   checkUncheckAll() {
    this.promocode.forEach(promocode => promocode.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.promocode.every(promocode => promocode.isSelected);
  }

  deletepromocode(data) {

    this.selectedIds = data._id;
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // ✅ Call delete API
        this._promocodeservice.deletePromocode(this.selectedIds,this.usertoken).subscribe({
          next: () => {
            this._toastrService.showSuccess("Deleted Successfully");
            this.loadPromocode(); // refresh table
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
    this.loadPromocode(this.page, this.pageSize);
  }

}

