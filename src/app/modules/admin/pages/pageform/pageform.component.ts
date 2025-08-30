import { Component,Inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-pageform',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './pageform.component.html',
  styleUrl: './pageform.component.scss'
})
export class PageformComponent {
  pageForm: FormGroup;
  

  constructor(private _router: Router,private fb: FormBuilder) {
    this.pageForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      title_ar: ['', [Validators.required, Validators.minLength(3)]],   
      description: ['', [Validators.required, Validators.maxLength(250)]],
      description_ar: ['', [Validators.required, Validators.maxLength(250)]],    
      pagename: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.pageForm.valid) {
      console.log('✅ Form Data:', this.pageForm.value);
    } else {
      this.pageForm.markAllAsTouched();
    }
  }

  // helper for template
  get f() {
    return this.pageForm.controls;
  }

  savePage(){

    if (this.pageForm.invalid) {
      this.pageForm.markAllAsTouched();  // ✅ show validation errors
      return;
    }
  
    console.log(this.pageForm.value); // ✅ form values when valid

  }

  onCancel() {
    this.pageForm.reset({ status: 'Active' });
    this._router.navigate(['/pages']);
  }  
}
