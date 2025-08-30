import { Component,Inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../../material.import';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute  } from '@angular/router';
import { QuillModule } from 'ngx-quill';   // ✅ Import here
@Component({
  selector: 'app-smstemplatesform',
  imports: [MATERIAL_IMPORTS, QuillModule],   // ✅ just one line
  templateUrl: './smstemplatesform.component.html',
  styleUrl: './smstemplatesform.component.scss'
})
export class SmstemplatesformComponent {
  templateForm: FormGroup;
  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link']
    ]
  };
  

  constructor(private _router: Router,private fb: FormBuilder) {
    this.templateForm = this.fb.group({      
      description: ['', [Validators.required, Validators.maxLength(250)]],
      description_ar: ['', [Validators.required, Validators.maxLength(250)]],    
      templatename: ['', Validators.required],
      status: ['Active', Validators.required]
    });
  }

  onSubmit() {
    if (this.templateForm.valid) {
      console.log('✅ Form Data:', this.templateForm.value);
    } else {
      this.templateForm.markAllAsTouched();
    }
  }

  // helper for template
  get f() {
    return this.templateForm.controls;
  }

  saveTemplate(){

    if (this.templateForm.invalid) {
      this.templateForm.markAllAsTouched();  // ✅ show validation errors
      return;
    }
  
    console.log(this.templateForm.value); // ✅ form values when valid

  }

  onCancel() {
    this.templateForm.reset({ status: 'Active' });
    this._router.navigate(['/smstemplates']);
  }  
}
