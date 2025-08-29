import { Component, OnInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../../material.import';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-promocode-form',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './promocodeform.component.html',
  styleUrls: ['./promocodeform.component.scss']
})
export class PromocodeformComponent implements OnInit {
  promocodeForm!: FormGroup;
  products: any[] = []; // replace with API data

  constructor(private fb: FormBuilder,private _router: Router) {}

  ngOnInit(): void {
    this.promocodeForm = this.fb.group({
      code: ['', Validators.required],
      description: ['', Validators.required],
      discountType: ['', Validators.required],
      discountValue: ['', [Validators.required, Validators.min(1)]],
      startDate: ['', Validators.required],
      expiryDate: ['', Validators.required],
      status: ['Active', Validators.required],
      productId: ['', Validators.required],
    });

    // Example product list (replace with API call)
    this.products = [
      { _id: '1', name: 'Product A' },
      { _id: '2', name: 'Product B' },
      { _id: '3', name: 'Product C' }
    ];
  }

  onSubmit() {
    if (this.promocodeForm.valid) {
      console.log('Form Data:', this.promocodeForm.value);
    } else {
      this.promocodeForm.markAllAsTouched();
    }
  }

  onCancel(){
    this._router.navigate(['/promocode']);
  }
}
