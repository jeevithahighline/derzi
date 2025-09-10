import { Component,Inject } from '@angular/core';
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
  editMode = false;   // ✅ track add/edit
  serviceId: number | null = null;

  categories = ['Stitching', 'Alteration', 'Dry Cleaning', 'Embroidery'];
  fabrics = ['Customer', 'Shop'];

  constructor(private _router: Router,private fb: FormBuilder,private route: ActivatedRoute) {}

  services = [
    { 
      id: 1, 
      name: 'Shirt Stitching',
      category: ['Stitching'],  // array since mat-select multiple
      description: 'details of what’s included',
      name_ar: 'قميص',
      description_ar: 'لوريم إيبسوم',
      price: 100,               // number only
      duration: 2,              // number only
      isSelected: false,
      fabricProvidedBy:["Customer"] 
    },
    { 
      id: 2, 
      name: 'Blouse Design',
      category: ['Embroidery'],
      description: 'details of what’s included',
      name_ar: 'قميص',
      description_ar: 'لوريم إيبسوم',
      price: 100,
      duration: 14,             // 2 weeks = 14 days
      isSelected: false,
      fabricProvidedBy:["Shop"]  
    }
  ];
  

  ngOnInit(): void {

    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      name_ar: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(250)]],
      description_ar: ['', [Validators.required, Validators.maxLength(250)]],
      price: [null, [Validators.required, Validators.min(1)]],
      duration: [null, [Validators.required, Validators.min(1)]],
      fabricProvidedBy: ['', Validators.required],
      status: ['Active']
    });
    // ✅ get id from route
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.editMode = true;
        this.serviceId = +id;
        this.loadServiceData(this.serviceId);
      }
    });
   
  }

  onSubmit() {
    if (this.serviceForm.valid) {
      console.log('✅ Form Data:', this.serviceForm.value);
      this._router.navigate(['/services']);
    } else {
      this.serviceForm.markAllAsTouched();
    }
  }

  loadServiceData(id: number){
    const service = this.services.find(b => b.id === id);
    if (service) {
      this.serviceForm.patchValue(service);
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
