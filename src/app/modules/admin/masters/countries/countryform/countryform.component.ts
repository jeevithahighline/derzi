import { Component,Inject,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../../../material.import';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of, throwError ,Observable,lastValueFrom  } from 'rxjs';
import { CountryService } from '../../../../../core/services/country.service';
import { tap, catchError,takeWhile } from 'rxjs/operators';
import { ToastService } from '../../../../../core/services/toastr.service';

@Component({
  selector: 'app-countryform',
  standalone: true,
  imports: [MATERIAL_IMPORTS],
  templateUrl: './countryform.component.html',
  styleUrls: ['./countryform.component.scss']
})
export class CountryformComponent {
  dynamicForm: FormGroup;
  isEditMode = false;
  editId: string | null;
  usertoken:any;

  constructor(
    private fb: FormBuilder,private _masterservice: CountryService,private _toastrService: ToastService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CountryformComponent>
  ) {}

  ngOnInit(): void {
   
    this.usertoken = localStorage.getItem('usertoken'); // get token
    this.dynamicForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      status: [null, Validators.required]
    });

    // Prefill if editing
    if (this.data?.country) {

      //console.log(this.data.country);
      this.editId = this.data.country._id;     
      // Patch form directly with backend data
      this.dynamicForm.patchValue(this.data.country);
    }
  }

  save() {
    if (this.dynamicForm.invalid) {
      this.dynamicForm.markAllAsTouched();  // ✅ force all errors to show
      return;
    }
    const formValues = { ...this.dynamicForm.value };

    const payload = {
      ...formValues
    };

    //console.log(payload);

    if (this.editId) {
      this.updateData(payload, this.editId).subscribe();
      this.dialogRef.close(true);
    } else {
      this.saveData(payload).subscribe();
      this.dialogRef.close(true);
    }
  }
  
  public saveData(data: any): Observable<any> {

   const insertData = {
      name: data.name,
      code: data.code,
      status: data.status   // ✅ convert
    };
   
    return this._masterservice.createCountry(insertData, this.usertoken).pipe(
      tap(res => this.handleApiResponse(res, 'Country created successfully', 'Country creation failed')),
      catchError(error => this.handleError(error, 'Country is not created. Please contact administrator'))
    );   
    
  }
  
  public updateData(data: any, editId: any): Observable<any> {    
  
   
    const updatedInfo = {
      name: data.name,
      code: data.code,
      status: data.status  // ✅ convert
    };
   
    return this._masterservice.updateCountry(this.editId,updatedInfo,this.usertoken).pipe(
      tap(res => this.handleApiResponse(res, 'Country updated successfully', 'Country updation failed')),
      catchError(error => this.handleError(error, 'Country is not created. Please contact administrator'))
    );   
    
  }

   // APIs for save,update,delete and multi delte

  private handleApiResponse(res: any, successMessage: string, failureMessage: string): void {
    //console.log("API Response:", res);
  
    if (res.status === true) {
      // ✅ success
      this._toastrService.showSuccess(res.msg || successMessage);
     
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
  

  
  close() {
    this.dialogRef.close();
  }
}
