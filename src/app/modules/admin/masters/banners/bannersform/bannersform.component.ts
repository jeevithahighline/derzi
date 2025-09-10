import { Component,Inject,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../../../material.import';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { Router,ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-bannersform',
  standalone: true,
  imports: [MATERIAL_IMPORTS],
  templateUrl: './bannersform.component.html',
  styleUrl: './bannersform.component.scss'
})
export class BannersformComponent {
  dynamicForm: FormGroup;
  selectedFileName = '';
  selectedBannerType: string = '';
  entityOptions: { id: string; name: string }[] = [];  // holds dynamic options
  editMode = false;   // ✅ track add/edit
  bannerId: number | null = null;

  // dummy data for demo — later replace with API call
  banners = [
    { id: 1, name: 'Fashion', name_ar: 'موضة', description: "Lorem ipsum", description_ar: "لوريم إيبسوم", status: 'Active', bannerType: 'page', entityId: '1' },
    { id: 2, name: 'Clothing', name_ar: 'ملابس', description: "Dolor sit", description_ar: "دولور سيت", status: 'Inactive', bannerType: 'merchant', entityId: '101' }
  ];

  constructor(private _router: Router,private fb: FormBuilder,private route: ActivatedRoute) {}

  ngOnInit(): void {

    this.dynamicForm = this.fb.group({
      name: ['', Validators.required],
      name_ar: ['', Validators.required],
      description: ['', Validators.required],
      description_ar: ['', Validators.required],
      image: [null, Validators.required],
      status: ['Active', Validators.required],
      bannerType: ['', Validators.required],  // ✅ new field
      entityId: ['', Validators.required]      // ✅ linked to banner type
    });
 
    // ✅ get id from route
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.editMode = true;
        this.bannerId = +id;
        this.loadBannerData(this.bannerId);
      }
    });
   
  }

  // ✅ load values (replace with service API call in real app)
  loadBannerData(id: number) {
    const banner = this.banners.find(b => b.id === id);
    if (banner) {
      this.dynamicForm.patchValue(banner);
      this.onBannerTypeChange(banner.bannerType); // prefill entity options
    }
  }

  onSubmit() {
    if (this.dynamicForm.invalid) {
      this.dynamicForm.markAllAsTouched();
      return;
    }

    if (this.editMode) {
      console.log('🔄 Update banner:', this.dynamicForm.value);
      // call update API here
    } else {
      console.log('➕ Create new banner:', this.dynamicForm.value);
      // call create API here
    }

    this._router.navigate(['/banners']);
  }

  // ✅ Handle Banner Type change
  onBannerTypeChange(type: string) {
    this.selectedBannerType = type;
    this.entityOptions = [];  // reset options
    this.dynamicForm.patchValue({ entityId: '' });

    // Example: Replace with API calls
    switch (type) {
      case 'page':
        this.entityOptions = [
          { id: '1', name: 'Home Page' },
          { id: '2', name: 'Offers Page' }
        ];
        break;

      case 'merchant':
        this.entityOptions = [
          { id: '101', name: 'Amazon' },
          { id: '102', name: 'Flipkart' }
        ];
        break;

      case 'category':
        this.entityOptions = [
          { id: '201', name: 'Electronics' },
          { id: '202', name: 'Fashion' }
        ];
        break;

      case 'product':
        this.entityOptions = [
          { id: '301', name: 'iPhone 15' },
          { id: '302', name: 'Samsung TV' }
        ];
        break;
    }

  } 

  // helper for template
  get f() {
    return this.dynamicForm.controls;
  }

  saveBanner(){

    if (this.dynamicForm.invalid) {
      this.dynamicForm.markAllAsTouched();  // ✅ show validation errors
      return;
    }
  
    console.log(this.dynamicForm.value); // ✅ form values when valid

  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.dynamicForm.patchValue({ image: file });
      this.dynamicForm.get('image')?.updateValueAndValidity();
    }
  }

  onCancel() {
    this.dynamicForm.reset({ status: 'Active' });
    this._router.navigate(['/banners']);
  }  
}
