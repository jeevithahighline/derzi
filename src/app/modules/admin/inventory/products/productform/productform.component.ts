import { Component,Inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../../material.import';
import { FormBuilder, FormGroup, Validators,FormArray } from '@angular/forms';
import { Router,ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-productform',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './productform.component.html',
  styleUrl: './productform.component.scss'
})
export class ProductformComponent {
  productForm: FormGroup;

  // 🔹 Static dropdown data for now
  merchants = [
    { _id: '68abdbe89f34784334b160e4', name: 'Merchant A' },
    { _id: '68abdbe89f34784334b160e5', name: 'Merchant B' }
  ];

  categories = [
    { _id: '68ab18dc7376c157f8ef915f', name: 'T-Shirts' },
    { _id: '68ab18dc7376c157f8ef9160', name: 'Jeans' }
  ];

  lengths = [
    { _id: '68aaec585d478029a87b69b6', name: 'Short' },
    { _id: '68aaec585d478029a87b69b7', name: 'Long' }
  ];

  fabrics = [
    { _id: '68aaeeb1a3ad436d90c66593', name: 'Cotton' },
    { _id: '68aaeeb1a3ad436d90c66594', name: 'Silk' }
  ];

  types = [
    { _id: '68aad1d4b5044b32b0055164', name: 'Casual' },
    { _id: '68aad1d4b5044b32b0055165', name: 'Formal' }
  ];

  brands = [
    { _id: '68aad9e400b3e53cf01f82a6', name: 'BrandX' },
    { _id: '68aad9e400b3e53cf01f82a7', name: 'BrandY' }
  ];

  sizes = [
    { _id: '68aaf12c9a8582497c7ebefc', name: 'M' },
    { _id: '68aaf12c9a8582497c7ebefd', name: 'L' }
  ];

  colors = [
    { _id: '68aaf1a39a8582497c7ebf0a', name: 'Red' },
    { _id: '68aaf1a39a8582497c7ebf0b', name: 'Blue' }
  ];

  cares = [
    { _id: '68aaf3429a8582497c7ebf1e', name: 'Dry Clean' },
    { _id: '68aaf3429a8582497c7ebf1f', name: 'Machine Wash' }
  ];

  countries = [
    { _id: '68aaf3429a8582497c7ebf1e', name: 'Bahrain' },
    { _id: '68aaf3429a8582497c7ebf20', name: 'India' }
  ];

  currencies = ['BHD', 'USD', 'INR'];

  constructor(private _router: Router,private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      name_ar: ['', Validators.required],
      description: ['', Validators.required],
      description_ar: ['', Validators.required],
      category: ['', Validators.required],
      quantity: ['', Validators.required],
      merchant_id: ['', Validators.required],
      length_id: ['', Validators.required],
      fabric_id:  ['', Validators.required],
      type_id:  ['', Validators.required],
      brand_id: ['', Validators.required],
      size_id:  ['', Validators.required],
      color_id:  ['', Validators.required],
      care_id:  ['', Validators.required],
      country_id: ['', Validators.required],
      price: ['', Validators.required],
      currency: ['', Validators.required],
      vatPercentage: ['', Validators.required],
      status: ['Active'],
      userId: ['', Validators.required],
      images: this.fb.array([])  // <-- FormArray for images
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      console.log('✅ Form Data:', this.productForm.value);
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  // helper for template
  get f() {
    return this.productForm.controls;
  }

  saveService(){

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();  // ✅ show validation errors
      return;
    }
  
    console.log(this.productForm.value); // ✅ form values when valid

  }

  onCancel() {
    this.productForm.reset({ status: 'Active' });
    this._router.navigate(['/products']);
  }  

  get images(): FormArray {
    return this.productForm.get('images') as FormArray;
  }
  
  selectedFileNames: string[] = []; // store filenames for UI
  
  
  
  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.productForm.patchValue({ image: file });
      this.productForm.get('image')?.updateValueAndValidity();
    }
  }
  
}

