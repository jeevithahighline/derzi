import { Component,Inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';
@Component({
  selector: 'app-merchants',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './merchants.component.html',
  styleUrl: './merchants.component.scss'
})

export class MerchantsComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;
  constructor(private _router: Router,private dialog: MatDialog) {} 


  merchants = [
    {
      "id":1,
     "merchant_id": 'M002',
      "merchant_name": 'Urban Style Hub',
      "firstname": "Ahmed",
      "lastname": "Khan",
      "email": "ahmed@example.com",
      "mobilenumber": "9876543210",
      "username": "johndriver",
      "password": "StrongPass123",
      "location": "New York",
      "status": "Active",
      isSelected: false
    }, 
    {
      id:2,
      "merchant_id": 'M001',
      "merchant_name": 'Trendy Threads',
      "firstname": "Salman",
      "lastname": "Doe",
      "email": "salman@example.com",
      "mobilenumber": "9876543210",
      "username": "samdriver",
      "password": "StrongPass123",
      "location": "New York",
      "status": "Active",
      isSelected: false
    }
  ];

  filteredMerchants() {
    return this.merchants.filter(m =>
      m.merchant_name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  
  editMerchant(merchant: any, index: number) {
    //alert(banner.id);
    this._router.navigate(['/addmerchant', merchant.id]);   
  }

  
  public deleteMerchant(index: number): void {
    //console.log('deleteselectedData', this.selectedIds);
  
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.merchants[index] = result; // 👈 update instead of push
      }
    });
    
  }

  addForm(){
    this._router.navigate(['/addmerchant']);
  }

   // Toggle all checkboxes
   checkUncheckAll() {
    this.merchants.forEach(merchant => merchant.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.merchants.every(merchant => merchant.isSelected);
  }
}
