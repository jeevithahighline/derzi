import { Component,Inject,OnInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router,ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-profilesettings',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './profilesettings.component.html',
  styleUrl: './profilesettings.component.scss'
})
export class ProfilesettingsComponent implements OnInit{
  profileForm: FormGroup;
  passwordForm: FormGroup;

  constructor(private _router: Router,private fb: FormBuilder) {}

  ngOnInit(): void {
    // Profile form
    this.profileForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(3)]],
      lastname: [''],
      email: ['', [Validators.required, Validators.email]]
    });

    // Password form
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.minLength(6)]],
        confirmPassword: ['']
      },
      { validators: this.passwordMatchValidator }
    );
  }  

  passwordMatchValidator(form: AbstractControl) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  // Save profile info (only firstname, lastname, email)
  onUpdateProfile() {
    if (this.profileForm.valid) {
      console.log('Profile Update:', this.profileForm.value);
      // call API → update firstname, lastname, email
    }
  }

  // Save password change separately
  onChangePassword() {
    if (this.passwordForm.valid) {
      console.log('Password Change:', this.passwordForm.value);
      // call API → update password only
    }
  }

  // helper for template
  get f() {
    return this.profileForm.controls;
  }
  
  onCancel() {
    this.profileForm.reset();   
  }  
}



