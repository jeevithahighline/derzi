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
  editMode = false;   // ✅ track add/edit
  promocodeId: number | null = null;
  constructor(private fb: FormBuilder,private _router: Router,private route: ActivatedRoute) {}

  // 🔹 Static dropdown data for now
  products = [
    { _id: '68abdbe89f34784334b160e4', name: 'Product A' },
    { _id: '68abdbe89f34784334b160e5', name: 'Product B' }
  ];

  promocodes = [
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
      status: 'Active'
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
      status: 'Inactive'
    }
  ];
  

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

     // ✅ get id from route
     this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.editMode = true;
        this.promocodeId = +id;
        this.loadPromoData(this.promocodeId);
      }
    });
  }

  loadPromoData(id: number){
    const code = this.promocodes.find(b => b.id === id);
    if (code) {
      this.promocodeForm.patchValue(code);
    }
  }


  onSubmit() {
    if (this.promocodeForm.valid) {
      console.log('Form Data:', this.promocodeForm.value);
      this._router.navigate(['/promocode']);
    } else {
      this.promocodeForm.markAllAsTouched();
    }
  }

  onCancel(){
    this._router.navigate(['/promocode']);
  }
}
