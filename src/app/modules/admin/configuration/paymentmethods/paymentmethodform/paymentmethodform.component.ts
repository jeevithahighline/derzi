import { Component,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../../../material.import';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tap, catchError,takeWhile } from 'rxjs/operators';
import { ToastService } from '../../../../../core/services/toastr.service';
import { of, throwError ,Observable,lastValueFrom  } from 'rxjs';
import { PaymentMethodService } from '../../../../../core/services/paymentmethod.service';
@Component({
  selector: 'app-paymentmethodform',
  standalone: true,
  imports: [MATERIAL_IMPORTS],
  templateUrl: './paymentmethodform.component.html',
  styleUrl: './paymentmethodform.component.scss'
})

export class PaymentmethodformComponent {
  dynamicForm: FormGroup;
  isEditMode = false;
  editId: string | null;
  usertoken:any;


  constructor(
    private fb: FormBuilder,private _masterservice: PaymentMethodService,private _toastrService: ToastService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PaymentmethodformComponent>
  ) {}

  ngOnInit(): void {
    this.usertoken = localStorage.getItem('usertoken'); // get token
    this.dynamicForm = this.fb.group({
      methodname: ['', Validators.required],
      status: [null, Validators.required]
    });

    // Prefill if editing
    if (this.data?.payment) {
      this.editId = this.data.payment._id;     
      this.dynamicForm.patchValue(this.data.payment);
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
      methodname: data.methodname,
      status: data.status,
      userId:localStorage.getItem('userId') 
    };
   
    return this._masterservice.createPaymentMethod(insertData, this.usertoken).pipe(
      tap(res => this.handleApiResponse(res, 'Payment Method created successfully', 'Payment Method creation failed')),
      catchError(error => this.handleError(error, 'Payment Method is not created. Please contact administrator'))
    );   
    
  }
  
  public updateData(data: any, editId: any): Observable<any> {    
  
   
    const updatedInfo = {
      methodname: data.methodname,
      status: data.status,
      userId:localStorage.getItem('userId') 
    };
   
    return this._masterservice.updatePaymentMethod(this.editId,updatedInfo,this.usertoken).pipe(
      tap(res => this.handleApiResponse(res, 'Payment Method updated successfully', 'Payment Method updation failed')),
      catchError(error => this.handleError(error, 'Payment Method is not created. Please contact administrator'))
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
