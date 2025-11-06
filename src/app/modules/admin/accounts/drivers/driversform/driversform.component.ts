import { Component,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../../../material.import';
import { DriverService } from '../../../../../core/services/driver.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../../../core/services/toastr.service';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-driversform',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './driversform.component.html',
  styleUrl: './driversform.component.scss'
})
export class DriversformComponent {
  driverform: FormGroup;
  editId: string | null;
  editMode = false;   // ✅ track add/edit
  merchantId: any;
  backendUrl = environment.backendurlImages;
  usertoken: any;

  categories: any[] = [];
  services: any[] = [];
  // Track multiple file names for each control
  selectedFileNames: { [key: string]: string[] } = {};

  // Track multiple previews for each control
  previewUrls: { [key: string]: string[] } = {};
  merchantDetails:any;

  constructor(
    private _router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _driverservice: DriverService,
    private _toastrService: ToastService
  ) {}

  ngOnInit(): void {

    this.usertoken = localStorage.getItem('usertoken');

    this.merchantId = this.route.snapshot.paramMap.get('id') || '';

    this.driverform = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
      lastname: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      mobilenumber: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]],
      username:['', [Validators.required, Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255)]],     
      logo: [[]], // will be populated via file upload handler
      location: ['', Validators.required],
      backdrop_image: [[]], // same as above
      status: [true, Validators.required],
    });

    if (this.merchantId) {
      this.editId = this.merchantId;
      this._driverservice.getSpecificDriver(this.merchantId, this.usertoken).subscribe({
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

            this.driverform.patchValue({
              firstname: this.merchantDetails.firstname || '',
              lastname:this.merchantDetails.lastname || '',
              username: this.merchantDetails.username || '',
              email: this.merchantDetails.email || '',
              location: this.merchantDetails.location || '',
              mobilenumber:this.merchantDetails.mobilenumber || '',
              status: this.merchantDetails.status,  
              password:"DerziAPP@2025",           
              logo: [],        // will be filled when user selects new files
              backdrop_image: []
            });
            
          }
        },
        error: (err) => console.error('Error fetching merchant details', err)
      });
    }
  }

  
  
  // File upload handlers
  onFileSelected(event: Event, controlName: string) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
  
    const files = Array.from(input.files); // always an array
  
    // patch the form with an array of files
    this.driverform.patchValue({ [controlName]: files });
    this.driverform.get(controlName)?.updateValueAndValidity();
  
    // save filenames for display
    this.selectedFileNames[controlName] = files.map(f => f.name);
  
    // generate previews
    this.previewUrls[controlName] = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => this.previewUrls[controlName].push(reader.result as string);
      reader.readAsDataURL(file);
    });
  }


  onSubmit() {
    if (this.driverform.invalid) {
      this.driverform.markAllAsTouched();
      return;
    }
    const payload = { ...this.driverform.value };

    if (this.editId) {
      this.updateData(payload, this.editId).subscribe();
    } else {
      this.saveData(payload).subscribe();
    }
  }

  // helper for template
  get f() {
    return this.driverform.controls;
  }

  saveData(data: any): Observable<any> {
    const backdropFile = this.driverform.get('backdrop_image')?.value;
    const profileFile = this.driverform.get('logo')?.value;
    let payload: any;
  
    // ✅ Case 1: If at least one file exists → use FormData
    if (backdropFile instanceof File || profileFile instanceof File) {
      const formData = new FormData();      
      formData.append('firstname', data.firstname || '');
      formData.append('lastname', data.lastname || '');
      formData.append('email', data.email || '');
      formData.append('username', data.username || '');
      formData.append('mobilenumber', data.mobilenumber || '');
      formData.append('password', data.password || '');
      formData.append('status', data.status);
      formData.append('userId', localStorage.getItem('userId') || '');
      formData.append('location', data.location || '');

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
        firstname: data.firstname || '',
        lastname: data.lastname || '',
        email: data.email || '',
        username: data.username || '',
        mobilenumber: data.mobilenumber || '',
        password: data.password || '',
        status: data.status,
        location: data.location,
        userId: localStorage.getItem('userId') || ''
      };
    }
  
    console.log(payload);
    return this._driverservice.createDriver(payload, this.usertoken).pipe(
      tap(res => {
        this._toastrService.showSuccess('Driver created successfully');
        this._router.navigate(['/drivers']);
      }),
      catchError(err => {
        const message = err?.error?.message || err?.message;
        this._toastrService.showError(message || 'Driver creation failed');
        return throwError(() => err);
      })
    );
  }
  
  

  updateData(data: any, editId: any): Observable<any> {
    const backdropFile = this.driverform.get('backdrop_image')?.value;
    const profileFile = this.driverform.get('logo')?.value;
  
    let payload: any;
  
    // 🔹 Case 1: At least one file → use FormData
    if (backdropFile instanceof File || profileFile instanceof File) {
      const formData = new FormData();  
      formData.append('location', data.location || '');
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
        
        firstname: data.firstname || '',
        lastname: data.lastname || '',
        email: data.email || '',
        username: data.username || '',
        mobilenumber: data.mobilenumber || '',
        password: data.password || '',
        status: data.status,
        location: data.location,
        userId: localStorage.getItem('userId') || ''
      };
    }
    console.log(payload);
    return this._driverservice.updateDriver(editId, payload, this.usertoken).pipe(
      tap(res => {
        this._toastrService.showSuccess('Driver updated successfully');
        this._router.navigate(['/drivers']);
      }),
      catchError(err => {
        const message = err?.error?.message || err?.message;
        this._toastrService.showError(message || 'Driver update failed');
        return throwError(() => err);
      })
    );
  }
 
  onCancel() {
    this.driverform.reset({ status: 'Active' });
    this._router.navigate(['/drivers']);
  }  
}






