import { Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../../material.import';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-merchantform',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './merchantform.component.html',
  styleUrl: './merchantform.component.scss'
})
export class MerchantformComponent {
  merchantform: FormGroup;
  

  constructor(private _router: Router,private fb: FormBuilder) {
    this.merchantform = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.minLength(3)]],   
      username: ['', [Validators.required]],
      email: ['', [Validators.required]],
      merchant_id: ['', [Validators.required]],
      merchant_name: ['', [Validators.required]],
      password: ['', [Validators.required]], 
      mobilenumber: ['', [Validators.required]], 
      location: ['', [Validators.required]], 
      status: ['Active', Validators.required], 

    });
  }

  onSubmit() {
    if (this.merchantform.valid) {
      console.log('✅ Form Data:', this.merchantform.value);
    } else {
      this.merchantform.markAllAsTouched();
    }
  }

  // helper for template
  get f() {
    return this.merchantform.controls;
  }

  saveMerchant(){

    if (this.merchantform.invalid) {
      this.merchantform.markAllAsTouched();  // ✅ show validation errors
      return;
    }
  
    console.log(this.merchantform.value); // ✅ form values when valid

  }

  onCancel() {
    this.merchantform.reset({ status: 'Active' });
    this._router.navigate(['/merchants']);
  }  
}


