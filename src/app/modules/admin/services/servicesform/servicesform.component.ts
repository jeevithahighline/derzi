import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TailoringService } from '../../../../core/services/tailoringservice.service';
import { ToastService } from '../../../../core/services/toastr.service';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MATERIAL_IMPORTS } from '../../../material.import';

@Component({
  selector: 'app-servicesform',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './servicesform.component.html',
  styleUrl: './servicesform.component.scss'
})
export class ServicesformComponent {
  serviceForm: FormGroup;
  editMode = false;   // ✅ track add/edit
  serviceId: string;
  editId: string | null;
  usertoken: any;
  serviceDetails: any;

  constructor(private _router: Router,private fb: FormBuilder,private route: ActivatedRoute,private _masterservice: TailoringService,private _toastrService: ToastService) {}

  ngOnInit(): void {

    this.serviceId = this.route.snapshot.paramMap.get('id') || '';
    console.log('service ID:', this.serviceId);

    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      name_ar: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(250)]],
      description_ar: ['', [Validators.required, Validators.maxLength(250)]],
      status: [true, Validators.required]
    });
    
     // ✅ get id from route
     if (this.serviceId) {
      this.editMode = true;
      this.editId = this.serviceId;

      this._masterservice.getSpecifictailoringservice(this.serviceId, this.usertoken).subscribe({
        next: (res) => {
          this.serviceDetails = res.data;
          console.log('Page details:', this.serviceDetails);

          if (this.serviceDetails) {
            this.serviceForm.patchValue({
              name: this.serviceDetails.name || '',
              name_ar: this.serviceDetails.name_ar || '',
              description: this.serviceDetails.description || '',
              description_ar: this.serviceDetails.description_ar || '',
              status: this.serviceDetails.status
            });            
          }
        },
        error: (err) => console.error('Error fetching service details', err)
      });
    }
   
  }

  // helper for template
  get f() {
    return this.serviceForm.controls;
  }

  saveService() {
    
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    const payload = { ...this.serviceForm.value };

    console.log(payload);

    if (this.editId) {
      this.updateData(payload, this.editId).subscribe();
    } else {
      this.saveData(payload).subscribe();
    }
  }

  public saveData(data: any): Observable<any> {

    const insertData = {
       name: data.name,
       name_ar: data.name_ar,
       description:data.description,
       description_ar:data.description_ar,
       status: data.status,
       userId:localStorage.getItem('userId') 
     };
    
     return this._masterservice.createtailoringservice(insertData, this.usertoken).pipe(
       tap(res => this.handleApiResponse(res, 'Page created successfully', 'Type creation failed')),
       catchError(error => this.handleError(error, 'Page is not created. Please contact administrator'))
     );   
     
   }
   
   public updateData(data: any, editId: any): Observable<any> {    
   
    
     const updatedInfo = {
      name: data.name,
      name_ar: data.name_ar,
      description:data.description,
       description_ar:data.description_ar,
       status: data.status,
      userId:localStorage.getItem('userId') 
     };
    
     return this._masterservice.updatetailoringservice(this.editId,updatedInfo,this.usertoken).pipe(
       tap(res => this.handleApiResponse(res, 'Page updated successfully', 'Type updation failed')),
       catchError(error => this.handleError(error, 'Page is not created. Please contact administrator'))
     );   
     
   }

    // APIs for save,update,delete and multi delte

  private handleApiResponse(res: any, successMessage: string, failureMessage: string): void {
    //console.log("API Response:", res);
  
    if (res.status === true) {
      // ✅ success
      this._toastrService.showSuccess(res.msg || successMessage);
      this._router.navigate(['/services']);
     
    } else {
      // fallback (in case API returns custom fail format)
      this._toastrService.showError(res.msg || failureMessage);
    }
  }
  
  
  private handleError(error: any, fallbackMessage: string): Observable<any> {
    console.error("API Error:", error);
  
    const message =
      error?.error?.message ||   // backend-provided message
      error?.message ||          // Angular HttpErrorResponse message
      fallbackMessage;           // fallback
  
    this._toastrService.showError(message);
  
    return throwError(() => error);
  }

  onCancel() {
    this.serviceForm.reset({ status: 'Active' });
    this._router.navigate(['/services']);
  }  
}
