import { Component,Inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-faqform',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './faqform.component.html',
  styleUrl: './faqform.component.scss'
})
export class FaqformComponent {
  faqform: FormGroup;
  

  constructor(private _router: Router,private fb: FormBuilder) {
    this.faqform = this.fb.group({
      question: ['', [Validators.required, Validators.minLength(3)]],
      question_ar: ['', [Validators.required, Validators.minLength(3)]],   
      answer: ['', [Validators.required, Validators.maxLength(250)]],
      answer_ar: ['', [Validators.required, Validators.maxLength(250)]]    
    });
  }

  onSubmit() {
    if (this.faqform.valid) {
      console.log('✅ Form Data:', this.faqform.value);
    } else {
      this.faqform.markAllAsTouched();
    }
  }

  // helper for template
  get f() {
    return this.faqform.controls;
  }

  savePage(){

    if (this.faqform.invalid) {
      this.faqform.markAllAsTouched();  // ✅ show validation errors
      return;
    }
  
    console.log(this.faqform.value); // ✅ form values when valid

  }

  onCancel() {
    this.faqform.reset({ status: 'Active' });
    this._router.navigate(['/faq']);
  }  
}

