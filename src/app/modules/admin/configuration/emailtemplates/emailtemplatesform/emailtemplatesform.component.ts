import { Component,Inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../../material.import';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute  } from '@angular/router';
import { QuillModule } from 'ngx-quill';   // ✅ Import here
@Component({
  selector: 'app-emailtemplatesform',
  imports: [MATERIAL_IMPORTS, QuillModule],   // ✅ just one line
  templateUrl: './emailtemplatesform.component.html',
  styleUrl: './emailtemplatesform.component.scss'
})
export class EmailtemplatesformComponent {
  templateForm: FormGroup;
  editMode = false;   // ✅ track add/edit
  templateId: number | null = null;
  templates = [
    { 
      id: 1, 
      templatename: 'Registration',
      title: 'Derzi - Registration',
      title_ar: 'ديرزي - التسجيل',
      description: 'Please read the below instructions carefully before completing your registration.',
      description_ar: 'يرجى قراءة التعليمات أدناه بعناية قبل إكمال التسجيل.',
      status: 'Active',
      isSelected: false
    },
    { 
      id: 2, 
      templatename: 'Login',
      title: 'Derzi - Login',
      title_ar: 'ديرزي - تسجيل الدخول',
      description: 'Please login using the credentials provided to you via email.',
      description_ar: 'يرجى تسجيل الدخول باستخدام بيانات الاعتماد المرسلة إلى بريدك الإلكتروني.',
      status: 'Inactive',
      isSelected: false
    },
    { 
      id: 3, 
      templatename: 'Password Reset',
      title: 'Derzi - Password Reset',
      title_ar: 'ديرزي - إعادة تعيين كلمة المرور',
      description: 'Click the link below to reset your password. This link will expire in 24 hours.',
      description_ar: 'انقر على الرابط أدناه لإعادة تعيين كلمة المرور الخاصة بك. سينتهي صلاحية الرابط خلال 24 ساعة.',
      status: 'Active',
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
    this._router.navigate(['/emailtemplates']);
  }

  onCancel() {
    this.templateForm.reset({ status: 'Active' });
    this._router.navigate(['/emailtemplates']);
  }  
}

