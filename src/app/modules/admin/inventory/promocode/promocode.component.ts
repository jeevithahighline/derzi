import { Component,Inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { FormBuilder, FormGroup, Validators,FormArray } from '@angular/forms';
import { Router,ActivatedRoute  } from '@angular/router';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';
import { MatDialog } from '@angular/material/dialog';

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
  constructor(private _router: Router,private route: ActivatedRoute,private fb: FormBuilder,private dialog: MatDialog) {}

  promocode = [
    {
      id: 1,
      code: 'SAVE10',
      productId: '68abdbe89f34784334b160e4', // must match one of your products._id
      discountType: 'Percentage',
      discountValue: 10,
      startDate: new Date('2025-09-01'),
      expiryDate: new Date('2025-09-30'),
      description: 'Get 10% off on selected products',
      description_ar: 'احصل على خصم 10٪ على المنتجات المختارة',
      status: 'Active',
      isSelected: false
    },
    {
      id: 2,
      code: 'FLAT50',
      productId: '68abdbe89f34784334b160e5',
      discountType: 'Flat',
      discountValue: 50,
      startDate: new Date('2025-08-15'),
      expiryDate: new Date('2025-12-31'),
      description: 'Flat 50 BHD off on Jeans',
      description_ar: 'خصم ثابت 50 دينار بحريني على الجينز',
      status: 'Inactive',
      isSelected: false
    }
  ];
  

  filteredData() {
    return this.promocode.filter(c =>
      c.code.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editpromocode(promocode: any, index: number) {
    this._router.navigate(['/addpromocode', promocode.id]);
  }

  deletepromocode(index: number) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.promocode[index] = result; // 👈 update instead of push
      }
    });
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

}

