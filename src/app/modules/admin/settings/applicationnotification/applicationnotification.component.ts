import { Component,Inject,OnInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute  } from '@angular/router';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-applicationnotification',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './applicationnotification.component.html',
  styleUrl: './applicationnotification.component.scss'
})
export class ApplicationnotificationComponent implements OnInit{
  notificationform: FormGroup;
  
  users = [
    { id: 1, name: 'John User' },
    { id: 2, name: 'Alice User' }
  ];
  
  merchants = [
    { id: 1, name: 'Shop A' },
    { id: 2, name: 'Shop B' }
  ];
  
  drivers = [
    { id: 1, name: 'Driver One' },
    { id: 2, name: 'Driver Two' }
  ];
  
  selectedTypeUsers: any[] = [];

  
  constructor(private _router: Router,private fb: FormBuilder) {}

  ngOnInit(): void {
    this.notificationform = this.fb.group({
      notificationtype: ['', Validators.required],
      title: ['', Validators.required],
      title_ar: ['', Validators.required],      
      message: ['', Validators.required],   
      message_ar: ['', Validators.required],   
    });
  }  

  onNotificationTypeChange(type: string) {
    if (type === 'User') {
      this.selectedTypeUsers = this.users;
      this.notificationform.get('targetUser')?.setValidators([Validators.required]);
    } else if (type === 'Merchants') {
      this.selectedTypeUsers = this.merchants;
      this.notificationform.get('targetUser')?.setValidators([Validators.required]);
    } else if (type === 'Drivers') {
      this.selectedTypeUsers = this.drivers;
      this.notificationform.get('targetUser')?.setValidators([Validators.required]);
    } else {
      this.selectedTypeUsers = [];
      this.notificationform.get('targetUser')?.clearValidators();
    }
    this.notificationform.get('targetUser')?.updateValueAndValidity();
  }
   

  onSubmit() {
    if (this.notificationform.valid) {
      console.log('✅ Form Data:', this.notificationform.value);
    } else {
      this.notificationform.markAllAsTouched();
    }
  }

  // helper for template
  get f() {
    return this.notificationform.controls;
  }

  savePage(){

    if (this.notificationform.invalid) {
      this.notificationform.markAllAsTouched();  // ✅ show validation errors
      return;
    }
  
    console.log(this.notificationform.value); // ✅ form values when valid

  }

  onCancel() {
    this.notificationform.reset();
   
  }  
}


