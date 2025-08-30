import { Component,Inject,OnInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute  } from '@angular/router';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-globalsettings',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './globalsettings.component.html',
  styleUrl: './globalsettings.component.scss'
})
export class GlobalsettingsComponent implements OnInit{
  globalform: FormGroup;
  

  constructor(private _router: Router,private fb: FormBuilder) {}

  ngOnInit(): void {
    this.globalform = this.fb.group({
      sitename: ['', [Validators.required, Validators.minLength(3)]],
      siteemail: ['', [Validators.required, Validators.email]],   
      mobilenumber: ['', [Validators.required, Validators.maxLength(250)]],
      address: ['', [Validators.required, Validators.maxLength(250)]],  
      postalcode: ['', Validators.required],   
      phonenumber: ['', Validators.required],   
      metaname: ['', Validators.required],   
      metadescription: ['', Validators.required],   
    });
  }  

  onSubmit() {
    if (this.globalform.valid) {
      console.log('✅ Form Data:', this.globalform.value);
    } else {
      this.globalform.markAllAsTouched();
    }
  }

  // helper for template
  get f() {
    return this.globalform.controls;
  }

  savePage(){

    if (this.globalform.invalid) {
      this.globalform.markAllAsTouched();  // ✅ show validation errors
      return;
    }
  
    console.log(this.globalform.value); // ✅ form values when valid

  }

  onCancel() {
    this.globalform.reset();
   
  }  
}


