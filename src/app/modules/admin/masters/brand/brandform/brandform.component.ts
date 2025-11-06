import { Component,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../../../material.import';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { tap, catchError,takeWhile } from 'rxjs/operators';
import { ToastService } from '../../../../../core/services/toastr.service';
import { of, throwError ,Observable,lastValueFrom  } from 'rxjs';
import { BrandService } from '../../../../../core/services/brand.service';

@Component({
  selector: 'app-brandform',
  standalone: true,
  imports: [MATERIAL_IMPORTS],
  templateUrl: './brandform.component.html',
  styleUrl: './brandform.component.scss'
})

export class BrandformComponent {
  dynamicForm: FormGroup;
  isEditMode = false;
  editId: string | null;
  usertoken:any;

  constructor(
    private fb: FormBuilder,private _masterservice: BrandService,private _toastrService: ToastService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<BrandformComponent>
  ) {}

  ngOnInit(): void {
    this.usertoken = localStorage.getItem('usertoken'); // get token
    this.dynamicForm = this.fb.group({
      name: ['', Validators.required],
      name_ar: ['', Validators.required],   
      status: [true, Validators.required]
    });

    // Prefill if editing
    if (this.data?.brand) {
      this.editId = this.data.brand._id;     
      this.dynamicForm.patchValue(this.data.brand);
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
      name_ar: data.name_ar,
      status: data.status,
      userId:localStorage.getItem('userId') 
    };
   
    return this._masterservice.createBrand(insertData, this.usertoken).pipe(
      tap(res => this.handleApiResponse(res, 'Brand created successfully', 'Brand creation failed')),
      catchError(error => this.handleError(error, 'Brand is not created. Please contact administrator'))
    );   
    
  }
  
  public updateData(data: any, editId: any): Observable<any> {    
  
   
    const updatedInfo = {
      name: data.name,
      name_ar: data.name_ar,
      status: data.status,
      userId:localStorage.getItem('userId') 
    };
   
    return this._masterservice.updateBrand(this.editId,updatedInfo,this.usertoken).pipe(
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
