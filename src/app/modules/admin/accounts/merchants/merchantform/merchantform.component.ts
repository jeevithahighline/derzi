import { Component,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../../../material.import';
import { MerchantService } from '../../../../../core/services/merchant.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../../../core/services/toastr.service';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-merchantform',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './merchantform.component.html',
  styleUrl: './merchantform.component.scss'
})
export class MerchantformComponent {
  merchantform: FormGroup;
  editId: string | null;
  editMode = false;   // ✅ track add/edit
  merchantId: any;
  backendUrl = environment.backendurlImages;
  usertoken: any;

  categories: any[] = [];
  services: any[] = [];
  // Track multiple file names for each control
   merchantDetails:any;

  previewUrls: { [key: string]: string[] | null } = {
    logo: null,
    backdrop_image: null
  };
  
  selectedFileNames: { [key: string]: string } = {
    logo: '',
    backdrop_image: ''
  };

  constructor(
    private _router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _merchantservice: MerchantService,
    private _toastrService: ToastService
  ) {}

  ngOnInit(): void {

    this.usertoken = localStorage.getItem('usertoken');
    this.loadDropdownData();

    this.merchantId = this.route.snapshot.paramMap.get('id') || '';

    this.merchantform = this.fb.group({
      merchant_name: ['', [Validators.required, Validators.maxLength(255)]],
      firstname: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
      lastname: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      mobilenumber: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]],
      username: ['', [Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255)]],
      location: ['', [Validators.maxLength(255)]],
      latitude: ["", Validators.required],
      longitude: ["", Validators.required],
      description: [''],
      category: [[], Validators.required],  // multiple select
      service_id: [[], Validators.required], // multiple select
      logo: [[]], // will be populated via file upload handler
      backdrop_image: [[]], // same as above
      status: ["active", Validators.required]
    });

    if (this.merchantId) {
      this.editId = this.merchantId;
      this._merchantservice.getSpecificMerchant(this.merchantId, this.usertoken).subscribe({
        next: (res) => {
          this.merchantDetails = res.data;

          console.log(this.merchantDetails);

          if (this.merchantDetails) {

            // Preview URLs          

            this.previewUrls['logo'] = (this.merchantDetails.logo || []).map(
              (img: string) => this.backendUrl + img
            );
            
            this.previewUrls['backdrop_image'] = (this.merchantDetails.backdrop_image || []).map(
              (img: string) => this.backendUrl + img
            );
            

            console.log(this.previewUrls['logo']);

            // For display purposes
            this.selectedFileNames['logo'] = this.merchantDetails.logo?.map((p: string) => p.split('/').pop()) || [];
            this.selectedFileNames['backdrop_image'] = this.merchantDetails.backdrop_image?.map((p: string) => p.split('/').pop()) || [];

            this.merchantform.patchValue({
              merchant_name: this.merchantDetails.merchant_name || '',
              description: this.merchantDetails.description || '',
              firstname: this.merchantDetails.firstname || '',
              lastname:this.merchantDetails.lastname || '',
              username: this.merchantDetails.username || '',
              email: this.merchantDetails.email || '',
              mobilenumber:this.merchantDetails.mobilenumber || '',
              status: this.merchantDetails.status,
              location: this.merchantDetails.location,
              latitude: this.merchantDetails.latitude,
              longitude: this.merchantDetails.longitude,
              password:"DerziAPP@2025", 
              category: this.merchantDetails.category || [],
              service_id: this.merchantDetails.service_id || [],
              logo: [],        // will be filled when user selects new files
              backdrop_image: []
            });
            
          }
        },
        error: (err) => console.error('Error fetching merchant details', err)
      });
    }
  }

  loadDropdownData(): void {
    this._merchantservice.getAllCategories(this.usertoken).subscribe(res => this.categories = res.data.docs);
    this._merchantservice.getAllServices(this.usertoken).subscribe(res => this.services = res.data.docs);
    
  }
  
  // File upload handlers
  onFileSelected(event: Event, controlName: string) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
  
    const file = input.files[0]; // ✅ take only the first file
  
    // patch the form with single file
    this.merchantform.patchValue({ [controlName]: file });
    this.merchantform.get(controlName)?.updateValueAndValidity();
  
    // save filename for display
    this.selectedFileNames[controlName] = file.name;
  
    // generate preview
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrls[controlName] = [reader.result as string]; // store as array for template
    };
    reader.readAsDataURL(file);
  }
  


  onSubmit() {
    if (this.merchantform.invalid) {
      this.merchantform.markAllAsTouched();
      return;
    }
    const payload = { ...this.merchantform.value };

    if (this.editId) {
      this.updateData(payload, this.editId).subscribe();
    } else {
      this.saveData(payload).subscribe();
    }
  }

  // helper for template
  get f() {
    return this.merchantform.controls;
  }

  saveData(data: any): Observable<any> {
    const backdropFile = this.merchantform.get('backdrop_image')?.value;
    const profileFile = this.merchantform.get('logo')?.value;
    let payload: any;
  
    // ✅ Case 1: If at least one file exists → use FormData
    if (backdropFile instanceof File || profileFile instanceof File) {
      const formData = new FormData();
      formData.append('merchant_name', data.merchant_name || '');
      formData.append('description', data.description || '');
      formData.append('latitude', data.latitude || '');
      formData.append('longitude', data.longitude || '');
      formData.append('location', data.location || '');
      formData.append('category', data.category || '');
      formData.append('service_id', data.service_id || '');
      formData.append('firstname', data.firstname || '');
      formData.append('lastname', data.lastname || '');
      formData.append('email', data.email || '');
      formData.append('username', data.username || '');
      formData.append('mobilenumber', data.mobilenumber || '');
      formData.append('password', data.password || '');
      formData.append('status', data.status);
      formData.append('userId', localStorage.getItem('userId') || '');
  
      if (backdropFile instanceof File) {
        formData.append('backdrop_image', backdropFile, backdropFile.name);
      }
      if (profileFile instanceof File) {
        formData.append('logo', profileFile, profileFile.name);
      }
  
      payload = formData;
    } 
    // ✅ Case 2: No files → just send JSON
    else {
      payload = {
        merchant_name:data.merchant_name || '', 
        description:data.description || '', 
        firstname: data.firstname || '',
        category:data.category || '',
        service_id:data.service_id || '',
        lastname: data.lastname || '',
        email: data.email || '',
        username: data.username || '',
        mobilenumber: data.mobilenumber || '',
        password: data.password || '',
        location: data.location || '',
        latitude: data.latitude || '',
        longitude: data.longitude || '',
        status: data.status,
        userId: localStorage.getItem('userId') || ''
      };
    }
  
    console.log(payload);
    return this._merchantservice.createMerchant(payload, this.usertoken).pipe(
      tap(res => {
        this._toastrService.showSuccess('Merchant created successfully');
        this._router.navigate(['/merchants']);
      }),
      catchError(err => {
        const message = err?.error?.message || err?.message;
        this._toastrService.showError(message || 'Merchant creation failed');
        return throwError(() => err);
      })
    );
  }
  
  

  updateData(data: any, editId: any): Observable<any> {
    const backdropFile = this.merchantform.get('backdrop_image')?.value;
    const profileFile = this.merchantform.get('logo')?.value;
  
    let payload: any;
  
    // 🔹 Case 1: At least one file → use FormData
    if (backdropFile instanceof File || profileFile instanceof File) {
      const formData = new FormData();
  
      formData.append('merchant_name', data.merchant_name || '');
      formData.append('description', data.description || '');
      formData.append('location', data.location || '');
      formData.append('latitude', data.latitude || '');
      formData.append('longitude', data.longitude || '');
      formData.append('category', data.category || '');
      formData.append('service_id', data.service_id || '');
      formData.append('firstname', data.firstname || '');
      formData.append('lastname', data.lastname || '');
      formData.append('email', data.email || '');
      formData.append('username', data.username || '');
      formData.append('mobilenumber', data.mobilenumber || '');
      formData.append('password', data.password || '');
      formData.append('status', data.status);
      formData.append('userId', localStorage.getItem('userId') || '');
  
      if (backdropFile instanceof File) {
        formData.append('backdrop_image', backdropFile, backdropFile.name);
      }
  
      if (profileFile instanceof File) {
        formData.append('logo', profileFile, profileFile.name);
      }
  
      payload = formData;
    } 
    // 🔹 Case 2: No files → send plain JSON
    else {
      payload = {
        merchant_name:data.merchant_name || '', 
        description:data.description || '', 
        firstname: data.firstname || '',
        category:data.category || '',
        service_id:data.service_id || '',
        lastname: data.lastname || '',
        email: data.email || '',
        username: data.username || '',
        mobilenumber: data.mobilenumber || '',
        password: data.password || '',
        location: data.location || '',
        latitude: data.latitude || '',
        longitude: data.longitude || '',
        status: data.status,
        userId: localStorage.getItem('userId') || ''
      };
    }
    console.log(payload);
    return this._merchantservice.updateMerchant(editId, payload, this.usertoken).pipe(
      tap(res => {
        this._toastrService.showSuccess('Merchant updated successfully');
        this._router.navigate(['/merchants']);
      }),
      catchError(err => {
        const message = err?.error?.message || err?.message;
        this._toastrService.showError(message || 'Merchant update failed');
        return throwError(() => err);
      })
    );
  }
 
  onCancel() {
    this.merchantform.reset({ status: 'Active' });
    this._router.navigate(['/merchants']);
  }  
}


