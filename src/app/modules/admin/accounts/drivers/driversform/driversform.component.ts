import { Component,Inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../../material.import';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-driversform',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './driversform.component.html',
  styleUrl: './driversform.component.scss'
})
export class DriversformComponent {
  driverform: FormGroup
  editMode = false;   // ✅ track add/edit
  driverId: number | null = null;

 
  drivers = [
    {
      "id":1,
      "firstname": "John",
      "lastname": "Doe",
      "email": "johndoe@example.com",
      "mobilenumber": "9876543210",
      "username": "johndriver",
      "password": "StrongPass123",
      "location": "New York",
      "status": "Active"
    }, 
    {
      id:2,
      "firstname": "Sameem",
      "lastname": "Doe",
      "email": "sameem@example.com",
      "mobilenumber": "9876543210",
      "username": "samdriver",
      "password": "StrongPass123",
      "location": "New York",
      "status": "Active"
    }
  ];

  constructor(private _router: Router,private fb: FormBuilder,private route: ActivatedRoute) {}

  ngOnInit(): void {
    
    this.driverform = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.minLength(3)]],   
      username: ['', [Validators.required]],
      email: ['', [Validators.required]],
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
        this.driverId = +id;
        this.loaddriverData(this.driverId);
      }
    });
  }

  loaddriverData(id: number){
    const page = this.drivers.find(b => b.id === id);
    if (page) {
      this.driverform.patchValue(page);
    }
  }

  onSubmit() {
    if (this.driverform.valid) {
      console.log('✅ Form Data:', this.driverform.value);
      this._router.navigate(['/drivers']);
    } else {
      this.driverform.markAllAsTouched();
    }
  }

  // helper for template
  get f() {
    return this.driverform.controls;
  }

  
  onCancel() {
    this.driverform.reset({ status: 'Active' });
    this._router.navigate(['/drivers']);
  }  
}



