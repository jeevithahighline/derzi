import { Component,Inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';

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
  constructor(private _router: Router) {}
  
  merchants = [
    {
      merchant_id: 'M001',
      merchant_name: 'Trendy Threads',
      category: 'Clothing',
      contact_email: 'trendy@threads.com',
      phone: '+91-9876543210',
      location: 'Mumbai, India',
      status: 'Active',
      isSelected: false
    },
    {
      merchant_id: 'M002',
      merchant_name: 'Urban Style Hub',
      category: 'Clothing',
      contact_email: 'urban@stylehub.com',
      phone: '+91-9123456780',
      location: 'Bangalore, India',
      status: 'Inactive',
      isSelected: false
    }
  ];

  filteredMerchants() {
    return this.merchants.filter(m =>
      m.merchant_name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editMerchant(merchant: any) {
    alert(`Editing ${merchant.merchant_name}`);
  }

  deleteMerchant(merchant: any) {
    alert(`Deleting ${merchant.merchant_name}`);
  }

  addForm(){
    this._router.navigate(['/addmerchant']);
  }

   // Toggle all checkboxes
   checkUncheckAll() {
    this.merchants.forEach(country => country.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.merchants.every(country => country.isSelected);
  }
}
