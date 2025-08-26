import { Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-servicesform',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './servicesform.component.html',
  styleUrl: './servicesform.component.scss'
})
export class ServicesformComponent {
  serviceForm: FormGroup;

  categories = ['Stitching', 'Alteration', 'Dry Cleaning', 'Embroidery'];
  fabrics = ['Customer', 'Shop'];

  constructor(private _router: Router,private fb: FormBuilder) {
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      name_ar: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(250)]],
      description_ar: ['', [Validators.required, Validators.maxLength(250)]],
      price: [null, [Validators.required, Validators.min(1)]],
      duration: [null, [Validators.required, Validators.min(1)]],
      fabricProvidedBy: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.serviceForm.valid) {
      console.log('✅ Form Data:', this.serviceForm.value);
    } else {
      this.serviceForm.markAllAsTouched();
    }
  }

  // helper for template
  get f() {
    return this.serviceForm.controls;
  }

  saveService(){

    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();  // ✅ show validation errors
      return;
    }
  
    console.log(this.serviceForm.value); // ✅ form values when valid

  }

  onCancel() {
    this.serviceForm.reset({ status: 'Active' });
    this._router.navigate(['/services']);
  }  
}
