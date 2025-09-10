import { Component,Inject } from '@angular/core';
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
  
  editMode = false;   // ✅ track add/edit
  merchantId: number | null = null;

  merchants = [
    {
      "id":1,
     "merchant_id": 'M002',
      "merchant_name": 'Urban Style Hub',
      "firstname": "Ahmed",
      "lastname": "Khan",
      "email": "ahmed@example.com",
      "mobilenumber": "9876543210",
      "username": "johndriver",
      "password": "StrongPass123",
      "location": "New York",
      "status": "Active",
      isSelected: false
    }, 
    {
      id:2,
      "merchant_id": 'M001',
      "merchant_name": 'Trendy Threads',
      "firstname": "Salman",
      "lastname": "Doe",
      "email": "salman@example.com",
      "mobilenumber": "9876543210",
      "username": "samdriver",
      "password": "StrongPass123",
      "location": "New York",
      "status": "Active",
      isSelected: false
    }
  ];


  constructor(private _router: Router,private fb: FormBuilder,private route: ActivatedRoute) {}

  ngOnInit(): void {

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

    // ✅ get id from route
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.editMode = true;
        this.merchantId = +id;
        this.loadMerchantData(this.merchantId);
      }
    });

  } 
  
  loadMerchantData(id: number){
    const page = this.merchants.find(b => b.id === id);
    if (page) {
      this.merchantform.patchValue(page);
    }
  }


  onSubmit() {
    if (this.merchantform.valid) {
      console.log('✅ Form Data:', this.merchantform.value);
      this._router.navigate(['/merchants']);
    } else {
      this.merchantform.markAllAsTouched();
    }
  }

  // helper for template
  get f() {
    return this.merchantform.controls;
  }

 
  onCancel() {
    this.merchantform.reset({ status: 'Active' });
    this._router.navigate(['/merchants']);
  }  
}


