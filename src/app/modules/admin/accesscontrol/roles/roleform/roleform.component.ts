import { Component,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../../../material.import';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { tap, catchError,takeWhile } from 'rxjs/operators';
import { ToastService } from '../../../../../core/services/toastr.service';
import { of, throwError ,Observable,lastValueFrom  } from 'rxjs';
import { RoleService } from '../../../../../core/services/role.service';

@Component({
  selector: 'app-roleform',
  standalone: true,
  imports: [MATERIAL_IMPORTS],
  templateUrl: './roleform.component.html',
  styleUrl: './roleform.component.scss'
})

export class RoleformComponent {
  dynamicForm: FormGroup;
  isEditMode = false;
  editId: string | null;
  usertoken:any;

  constructor(
    private fb: FormBuilder,private _masterservice: RoleService,private _toastrService: ToastService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<RoleformComponent>
  ) {}

  ngOnInit(): void {
    this.usertoken = localStorage.getItem('usertoken'); // get token
    this.dynamicForm = this.fb.group({
      role: ['', Validators.required],
      description: ['', Validators.required],
      status: [null, Validators.required]
    });

    // Prefill if editing
    if (this.data?.role) {
      this.editId = this.data.role._id;   
      this.dynamicForm.patchValue(this.data.role);
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
      role: data.role,
      description: data.description,
      status: data.status,
      userId:localStorage.getItem('userId') 
    };
   
    return this._masterservice.createRole(insertData, this.usertoken).pipe(
      tap(res => this.handleApiResponse(res, 'Role created successfully', 'Role creation failed')),
      catchError(error => this.handleError(error, 'Role is not created. Please contact administrator'))
    );   
    
  }
  
  public updateData(data: any, editId: any): Observable<any> {    
  
   
    const updatedInfo = {
      role: data.role,
      description: data.description,
      status: data.status,
      userId:localStorage.getItem('userId') 
    };
   
    return this._masterservice.updateRole(this.editId,updatedInfo,this.usertoken).pipe(
      tap(res => this.handleApiResponse(res, 'Role updated successfully', 'Role updation failed')),
      catchError(error => this.handleError(error, 'Role is not created. Please contact administrator'))
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



