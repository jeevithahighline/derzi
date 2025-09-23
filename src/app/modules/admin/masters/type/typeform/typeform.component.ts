import { Component,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../../../material.import';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tap, catchError,takeWhile } from 'rxjs/operators';
import { ToastService } from '../../../../../core/services/toastr.service';
import { of, throwError ,Observable,lastValueFrom  } from 'rxjs';
import { TypeService } from '../../../../../core/services/type.service';

@Component({
  selector: 'app-typeform',
  standalone: true,
  imports: [MATERIAL_IMPORTS],
  templateUrl: './typeform.component.html',
  styleUrl: './typeform.component.scss'
})

export class TypeformComponent {
  dynamicForm: FormGroup;
  isEditMode = false;
  editId: string | null;
  usertoken:any;
  constructor(
    private fb: FormBuilder,private _masterservice: TypeService,private _toastrService: ToastService, @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TypeformComponent>
  ) {}

  ngOnInit(): void {
    this.usertoken = localStorage.getItem('usertoken'); // get token
    this.dynamicForm = this.fb.group({
      name: ['', Validators.required],
      name_ar: ['', Validators.required],
      status: [null, Validators.required]
    });

    // Prefill if editing
    if (this.data?.type) {
      this.editId = this.data.type._id;     
      this.dynamicForm.patchValue(this.data.type);
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
   
    return this._masterservice.createType(insertData, this.usertoken).pipe(
      tap(res => this.handleApiResponse(res, 'Type created successfully', 'Type creation failed')),
      catchError(error => this.handleError(error, 'Type is not created. Please contact administrator'))
    );   
    
  }
  
  public updateData(data: any, editId: any): Observable<any> {    
  
   
    const updatedInfo = {
      name: data.name,
      name_ar: data.name_ar,
      status: data.status,
      userId:localStorage.getItem('userId') 
    };
   
    return this._masterservice.updateType(this.editId,updatedInfo,this.usertoken).pipe(
      tap(res => this.handleApiResponse(res, 'Type updated successfully', 'Type updation failed')),
      catchError(error => this.handleError(error, 'Type is not created. Please contact administrator'))
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