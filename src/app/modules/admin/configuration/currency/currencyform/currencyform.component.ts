import { Component,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../../../material.import';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tap, catchError,takeWhile } from 'rxjs/operators';
import { ToastService } from '../../../../../core/services/toastr.service';
import { of, throwError ,Observable,lastValueFrom  } from 'rxjs';
import { CurrencyService } from '../../../../../core/services/currency.service';
@Component({
  selector: 'app-currencyform',
  standalone: true,
  imports: [MATERIAL_IMPORTS],
  templateUrl: './currencyform.component.html',
  styleUrl: './currencyform.component.scss'
})

export class CurrencyformComponent {
  dynamicForm: FormGroup;
  isEditMode = false;
  editId: string | null;
  usertoken:any;


  constructor(
    private fb: FormBuilder,private _masterservice: CurrencyService,private _toastrService: ToastService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CurrencyformComponent>
  ) {}

  ngOnInit(): void {
    this.usertoken = localStorage.getItem('usertoken'); // get token
    this.dynamicForm = this.fb.group({
      currency: ['', Validators.required],
      status: [null, Validators.required]
    });

    // Prefill if editing
    if (this.data?.currency) {
      this.editId = this.data.currency._id;     
      this.dynamicForm.patchValue(this.data.currency);
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
      currency: data.currency,
      status: data.status,
      userId:localStorage.getItem('userId') 
    };
   
    return this._masterservice.createCurrency(insertData, this.usertoken).pipe(
      tap(res => this.handleApiResponse(res, 'Brand created successfully', 'Brand creation failed')),
      catchError(error => this.handleError(error, 'Brand is not created. Please contact administrator'))
    );   
    
  }
  
  public updateData(data: any, editId: any): Observable<any> {    
  
   
    const updatedInfo = {
      currency: data.currency,
      status: data.status,
      userId:localStorage.getItem('userId') 
    };
   
    return this._masterservice.updateCurrency(this.editId,updatedInfo,this.usertoken).pipe(
      tap(res => this.handleApiResponse(res, 'Brand updated successfully', 'Brand updation failed')),
      catchError(error => this.handleError(error, 'Brand is not created. Please contact administrator'))
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
