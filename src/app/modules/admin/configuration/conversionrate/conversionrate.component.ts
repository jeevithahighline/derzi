import { Component, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { ToastService } from '../../../../core/services/toastr.service';
import { ConversionRateService } from '../../../../core/services/conversionrate.service';

export interface Currency {
  _id?: string;   
  default: boolean;
  show: boolean;
  name: string;
  code: string;
  rate: number;
  exchangeFee: number;
  decimals: number;
  customSymbol: string;
}

@Component({
  selector: 'app-conversionrate',
  templateUrl: './conversionrate.component.html',
  styleUrls: ['./conversionrate.component.scss'],
  imports: [MATERIAL_IMPORTS]   // ✅ just one line

})


export class ConversionrateComponent {
  @ViewChild(MatTable) table!: MatTable<Currency>;
  usertoken:any;
  currencies: Currency[] = [];
  currencyCount:any;
  editId:any;
  displayedColumns: string[] = [
    'default',
    'show',
    'currency',
    'rate',
    'exchangeFee',
    'decimals',
    'customSymbol',
    'actions'
  ];

  constructor(private _toastrService: ToastService,private _conversionRateService:ConversionRateService) {}

  ngOnInit(): void {

    this.usertoken = localStorage.getItem('usertoken'); 
    this.loadCurrencies();
    
  }

  // ✅ Load all currencies from API
  loadCurrencies(): void {
    
    this._conversionRateService.getAllConversionRate(this.usertoken).subscribe({
      next: (res) => {
        
        this.currencyCount =  res.data.docs.length; 

        if(this.currencyCount == 0) {

          this.currencies = [
            { default: true, show: true, name: 'Bahraini dinar (د.ب)', code: 'BHD', rate: 1, exchangeFee: 0, decimals: 3, customSymbol: 'BHD' }           
          ];

        } else {

          this.currencies = res.data.docs || res; // depends on API response structure
        }
        
      },
      error: (err) => {
        console.error('Error loading conversionrates:', err);
      }
    });
  }

  

  /** ✅ Make selected currency default */
  setDefaultCurrency(selected: Currency): void {
    this.currencies.forEach(c => (c.default = false));
    selected.default = true;
  }

  /** ✅ Add a new blank currency row */
  addCurrency(): void {
    console.log('Add Currency clicked');
    const newCurrency: Currency = {
      default: false,
      show: true,
      name: '',
      code: '',
      rate: 1,
      exchangeFee: 0,
      decimals: 3,
      customSymbol: ''
    };

    this.currencies.push(newCurrency);

    // ✅ Force Angular Material table to refresh
    if (this.table) {
      this.table.renderRows();
    }
  }

  /** ✅ Delete currency by index */
  deleteCurrency(index: number): void {
    const currency = this.currencies[index];
  
    // 🚫 Prevent deleting default currency
    if (currency.default) {
      this._toastrService.showError('You cannot delete the default currency!');
      return;
    }
  
    // ✅ Confirm deletion with the user
    const confirmDelete = confirm(`Are you sure you want to delete ${currency.name}?`);
    if (!confirmDelete) return;
  
    // 🔐 Get auth token
    const token = localStorage.getItem('usertoken');
  
    // 🧾 If currency doesn't have an ID yet (not saved), just remove from UI
    if (!currency._id) {
      this.currencies.splice(index, 1);
      if (this.table) this.table.renderRows();
      return;
    }
  
    // 🔥 Call delete API
    this._conversionRateService.deleteConversionRate(currency._id, token).subscribe({
      next: (res) => {
        this._toastrService.showSuccess('Conversion Rate deleted successfully!');
        // Remove from table
        this.currencies.splice(index, 1);
        if (this.table) this.table.renderRows();
      },
      error: (err) => {
        console.error('Error deleting Conversion Rate:', err);
        this._toastrService.showError('Failed to delete Conversion Rate. Please try again.');
      }
    });
  }
  
  

  /** ✅ Example bulk update action */
  updateAllRates(): void {
    const payload = this.currencies.map(c => ({
      _id: c._id || null, // include _id if it exists
      default: c.default,
      show: c.show,
      name: c.name,
      code: c.customSymbol,
      rate: c.rate,
      exchangeFee: c.exchangeFee,
      decimals: c.decimals,
      customSymbol: c.customSymbol
    }));
  
    //console.log('Payload being sent:', payload);
  
    const token = localStorage.getItem('usertoken');
    this._conversionRateService.saveOrUpdateCurrencies(payload, token).subscribe({
      next: (res) => {
        console.log('✅ Rates updated successfully:', res);
        this._toastrService.showSuccess('Rates updated successfully');
        this.loadCurrencies(); // reload fresh data
      },
      error: (err) => {
        console.error('❌ Error updating rates:', err);
        this._toastrService.showError('Error saving rates. Please try again!');
      }
    });
  }
  
  
}

