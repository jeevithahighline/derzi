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
  editMode = false;   // ✅ track add/edit
  templateId: number | null = null;
  templates = [
    { 
      id: 1, 
      templatename: 'OTP',
      title: 'Derzi - OTP',
      title_ar: 'ديرزي - التسجيل',
      description: 'Please check the OTP',
      description_ar: 'يرجى قراءة التعليمات أدناه بعناية قبل إكمال التسجيل.',
      status: 'Active',
      isSelected: false
    },
    { 
      id: 2, 
      templatename: 'Registration Success',
      title: 'Derzi - Account Verification',
      title_ar: 'ديرزي - تسجيل الدخول',
      description: 'Your Account is verified successfully',
      description_ar: 'يرجى تسجيل الدخول باستخدام بيانات الاعتماد المرسلة إلى بريدك الإلكتروني.',
      status: 'Inactive',
      isSelected: false
    }
  ];
  
  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link']
    ]
  };
  

  constructor(private _router: Router,private fb: FormBuilder,private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.templateForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      title_ar: ['', [Validators.required, Validators.minLength(3)]],   
      description: ['', [Validators.required, Validators.maxLength(250)]],
      description_ar: ['', [Validators.required, Validators.maxLength(250)]],    
      templatename: ['', Validators.required],
      status: ['Active']
    });

    // ✅ get id from route
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.editMode = true;
        this.templateId = +id;
        this.loadtemplateData(this.templateId);
      }
    });
  }

  loadtemplateData(id: number){
    const page = this.templates.find(b => b.id === id);
    if (page) {
      this.templateForm.patchValue(page);
    }
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
    this._router.navigate(['/smstemplates']);
  }

  onCancel() {
    this.templateForm.reset({ status: 'Active' });
    this._router.navigate(['/smstemplates']);
  }  
}
