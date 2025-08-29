import { Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../../material.import';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-usersform',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './usersform.component.html',
  styleUrl: './usersform.component.scss'
})
export class UsersformComponent {
  userform: FormGroup;
  

  constructor(private _router: Router,private fb: FormBuilder) {
    this.userform = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.minLength(3)]],   
      username: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]], 
      mobilenumber: ['', [Validators.required]], 
      status: ['Active', Validators.required], 

    });
  }

  onSubmit() {
    if (this.userform.valid) {
      console.log('✅ Form Data:', this.userform.value);
    } else {
      this.userform.markAllAsTouched();
    }
  }

  // helper for template
  get f() {
    return this.userform.controls;
  }

  saveUser(){

    if (this.userform.invalid) {
      this.userform.markAllAsTouched();  // ✅ show validation errors
      return;
    }
  
    console.log(this.userform.value); // ✅ form values when valid

  }

  onCancel() {
    this.userform.reset({ status: 'Active' });
    this._router.navigate(['/users']);
  }  
}


