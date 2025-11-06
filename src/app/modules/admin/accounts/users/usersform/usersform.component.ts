import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../../core/services/user.service';
import { ToastService } from '../../../../../core/services/toastr.service';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MATERIAL_IMPORTS } from '../../../../material.import';

@Component({
  selector: 'app-usersform',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './usersform.component.html',
  styleUrl: './usersform.component.scss'
})
export class UsersformComponent {
  editMode = false;   // ✅ track add/edit
  userform: FormGroup;
  userId: string;
  editId: string | null;
  usertoken: any;
  userDetails: any;

 
  constructor(private _router: Router,private fb: FormBuilder,private route: ActivatedRoute,private _masterservice: UserService,private _toastrService: ToastService) {}
  

  ngOnInit(): void {

    this.userId = this.route.snapshot.paramMap.get('id') || '';
    console.log('user ID:', this.userId);

    this.userform = this.fb.group({
      firstname: ['', [Validators.required]], 
      lastname:['', [Validators.required]], 
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]], 
      mobilenumber: ['', [Validators.required]], 
      status: ["active", Validators.required]

    });

     // ✅ get id from route
     if (this.userId) {
      this.editMode = true;
      this.editId = this.userId;

      this._masterservice.getSpecificUser(this.userId, this.usertoken).subscribe({
        next: (res) => {
          this.userDetails = res.data;
          console.log('User details:', this.userDetails);

          if (this.userDetails) {
            this.userform.patchValue({
              firstname: this.userDetails.firstname || '',
              lastname: this.userDetails.lastname || '',
              username: this.userDetails.username || '',
              email: this.userDetails.email || '',
              mobilenumber: this.userDetails.mobilenumber || '',
              status: this.userDetails.status || '',
              password:"DerziAPP@2025", 
              emailVerified: this.userDetails.emailVerified || false,
              profile_image: this.userDetails.profile_image || [],
              backdrop_image: this.userDetails.backdrop_image || [],
              dob: this.userDetails.dob || null,
              gender: this.userDetails.gender || ''
            });            
          }
        },
        error: (err) => console.error('Error fetching userform details', err)
      });
    }

  } 
  
 
  
  // helper for template
  get f() {
    return this.userform.controls;
  }

  onSubmit() {
    
    if (this.userform.invalid) {
      this.userform.markAllAsTouched();
      return;
    }

    const payload = { ...this.userform.value };

    console.log(payload);

    if (this.editId) {
      this.updateData(payload, this.editId).subscribe();
    } else {
      this.saveData(payload).subscribe();
    }
  }

  saveData(data: any): Observable<any> {
    const backdropFile = this.userform.get('backdrop_image')?.value;
    const profileFile = this.userform.get('profile_image')?.value;
  
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
  
      if (backdropFile instanceof File) {
        formData.append('backdrop_image', backdropFile, backdropFile.name);
      }
      if (profileFile instanceof File) {
        formData.append('profile_image', profileFile, profileFile.name);
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
        userId: localStorage.getItem('userId') || ''
      };
    }
  
    return this._masterservice.createUser(payload, this.usertoken).pipe(
      tap(res => {
        this._toastrService.showSuccess('User created successfully');
        this._router.navigate(['/users']);
      }),
      catchError(err => {
        const message = err?.error?.message || err?.message;
        this._toastrService.showError(message || 'User creation failed');
        return throwError(() => err);
      })
    );
  }
  
  

  updateData(data: any, editId: any): Observable<any> {
    const backdropFile = this.userform.get('backdrop_image')?.value;
    const profileFile = this.userform.get('profile_image')?.value;
  
    let payload: any;
  
    // 🔹 Case 1: At least one file → use FormData
    if (backdropFile instanceof File || profileFile instanceof File) {
      const formData = new FormData();
  
      formData.append('firstname', data.firstname || '');
      formData.append('lastname', data.lastname || '');   
      //formData.append('email', data.email || '');
      formData.append('username', data.username || '');   
      //formData.append('mobilenumber', data.mobilenumber || '');
      formData.append('password', data.password || ''); 
      formData.append('status', data.status);
      formData.append('userId', localStorage.getItem('userId') || '');
  
      if (backdropFile instanceof File) {
        formData.append('backdrop_image', backdropFile, backdropFile.name);
      }
  
      if (profileFile instanceof File) {
        formData.append('profile_image', profileFile, profileFile.name);
      }
  
      payload = formData;
    } 
    // 🔹 Case 2: No files → send plain JSON
    else {
      payload = {
        firstname: data.firstname || '',
        lastname: data.lastname || '',
        //email: data.email || '',
        username: data.username || '',
        //mobilenumber: data.mobilenumber || '',
        password: data.password || '',
        status: data.status,
        userId: localStorage.getItem('userId') || ''
      };
    }
  
    return this._masterservice.updateUser(editId, payload, this.usertoken).pipe(
      tap(res => {
        this._toastrService.showSuccess('User updated successfully');
        this._router.navigate(['/users']);
      }),
      catchError(err => {
        const message = err?.error?.message || err?.message;
        this._toastrService.showError(message || 'User update failed');
        return throwError(() => err);
      })
    );
  }

  onCancel() {
    this.userform.reset({ status: 'Active' });
    this._router.navigate(['/users']);
  }  
}


