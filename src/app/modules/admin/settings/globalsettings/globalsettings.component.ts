import { Component,Inject,OnInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute  } from '@angular/router';
import { GlobalService } from '../../../../core/services/global.service';
import { ToastService } from '../../../../core/services/toastr.service';

@Component({
  selector: 'app-globalsettings',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './globalsettings.component.html',
  styleUrl: './globalsettings.component.scss'
})
export class GlobalsettingsComponent implements OnInit{
  globalform: FormGroup;
  usertoken:any;  

  constructor(private _router: Router,private fb: FormBuilder,private _globalService: GlobalService,private _toastrService: ToastService) {}

  ngOnInit(): void {

    this.usertoken = localStorage.getItem('usertoken'); 
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

    // ✅ Fetch existing site details if available
    this.loadSiteDetails();
  }  

  // Fetch details
  loadSiteDetails() {
    this._globalService.getSiteDetails(this.usertoken).subscribe({
      next: (res: any) => {
        if (res?.data) {
          //this.isEditMode = true;
          this.globalform.patchValue({
            sitename: res.data.site_name,
            siteemail: res.data.site_email,
            mobilenumber: res.data.mobile_number,
            address: res.data.address,
            postalcode: res.data.postalcode,
            phonenumber: res.data.phone_number,
            metaname: res.data.meta_name,
            metadescription: res.data.meta_description,
          });
        }
      },
      error: (err) => {
        console.error('Error fetching site details:', err);
        //this._toastrService.showError('Failed to load site details');
      }
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

  saveData(){

    if (this.globalform.invalid) {
      this.globalform.markAllAsTouched();  // ✅ show validation errors
      return;
    }
  
    console.log(this.globalform.value); // ✅ form values when valid

    const payload = {
      site_name: this.globalform.value.sitename,
      site_email: this.globalform.value.siteemail,
      mobile_number: this.globalform.value.mobilenumber,
      address: this.globalform.value.address,
      postalcode: this.globalform.value.postalcode,
      phone_number: this.globalform.value.phonenumber,
      meta_name: this.globalform.value.metaname,
      meta_description: this.globalform.value.metadescription,
      status:true,
      userId:localStorage.getItem('userId')
    };

    this._globalService.addOrUpdateSiteDetails(payload, this.usertoken).subscribe({
      next: (res: any) => {
        this._toastrService.showSuccess(res.msg || 'Site details saved successfully');
      },
      error: (err) => {
        console.error('Error saving site details:', err);
        this._toastrService.showError(err.error?.msg || 'Something went wrong');
      }
    });

  }

  onCancel() {
    this.globalform.reset();
   
  }  
}


