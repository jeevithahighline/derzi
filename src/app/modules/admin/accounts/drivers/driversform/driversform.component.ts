import { Component } from '@angular/core';
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
  driverform: FormGroup;
  

  constructor(private _router: Router,private fb: FormBuilder) {
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
  }

  onSubmit() {
    if (this.driverform.valid) {
      console.log('✅ Form Data:', this.driverform.value);
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



