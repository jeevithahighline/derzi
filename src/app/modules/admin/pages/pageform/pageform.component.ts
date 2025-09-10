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
  editMode = false;   // ✅ track add/edit
  pageId: number | null = null;

  pages = [
    {
      "id":1,
      "title": "Summer Collection",
      "title_ar": "مجموعة الصيف",
      "description": "Discover our exclusive summer collection with fresh styles and vibrant colors.",
      "description_ar": "اكتشف مجموعتنا الصيفية الحصرية مع أنماط جديدة وألوان زاهية. مثالية لهذا الموسم!",
      "pagename": "Home Page",
      "isSelected":true
    }   
  ];

  constructor(private _router: Router,private fb: FormBuilder,private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.pageForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      title_ar: ['', [Validators.required, Validators.minLength(3)]],   
      description: ['', [Validators.required, Validators.maxLength(250)]],
      description_ar: ['', [Validators.required, Validators.maxLength(250)]],    
      pagename: ['', Validators.required],
      status: ['Active']
    });

    // ✅ get id from route
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.editMode = true;
        this.pageId = +id;
        this.loadPageData(this.pageId);
      }
    });
  }

  loadPageData(id: number){
    const page = this.pages.find(b => b.id === id);
    if (page) {
      this.pageForm.patchValue(page);
    }
  }

  onSubmit() {
    if (this.pageForm.valid) {
      console.log('✅ Form Data:', this.pageForm.value);
      this._router.navigate(['/pages']);
    } else {
      this.pageForm.markAllAsTouched();
    }
  }

  // helper for template
  get f() {
    return this.pageForm.controls;
  }

  
  onCancel() {
    this.pageForm.reset({ status: 'Active' });
    this._router.navigate(['/pages']);
  }  
}
