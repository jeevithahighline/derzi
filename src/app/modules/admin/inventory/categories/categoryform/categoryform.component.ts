import { Component,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../../../material.import';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from '../../../../../core/services/category.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../../../core/services/toastr.service';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-categoryform',
  standalone: true,
  imports: [MATERIAL_IMPORTS],
  templateUrl: './categoryform.component.html',
  styleUrl: './categoryform.component.scss'
})

export class CategoryformComponent {
  dynamicForm: FormGroup;
  selectedFileName = '';
  editMode = false;
  categoryId: string;
  editId: string | null;
  usertoken: any;
  categoryDetails: any;
  previewUrls: { [key: string]: string } = {};
  backendUrl = environment.backendurlImages;

  constructor(
    private fb: FormBuilder,@Inject(MAT_DIALOG_DATA) public data: any,private route: ActivatedRoute,
    private _masterservice: CategoryService,
    private _toastrService: ToastService,
    private dialogRef: MatDialogRef<CategoryformComponent>
  ) {}

  ngOnInit(): void {
    this.usertoken = localStorage.getItem('usertoken'); // get token
    this.dynamicForm = this.fb.group({
      name: ['', Validators.required],
      name_ar: ['', Validators.required],
      cat_images: [null],
      cat_ar_images: [null],
      status: [true, Validators.required]
    });

    // Prefill if editing
    if (this.data?.category) {
      //console.log(this.data.category)
      this.editId = this.data.category._id;     
      this.dynamicForm.patchValue(this.data.category);

      // setup previews from API
      if (this.data.category.cat_images?.length > 0) {
        this.previewUrls.cat_images = this.backendUrl + this.data.category.cat_images[0];
        this.selectedFileNames.cat_images = this.data.category.cat_images[0].split('/').pop();
      }
      if (this.data.category.cat_ar_images?.length > 0) {
        this.previewUrls.cat_ar_images = this.backendUrl + this.data.category.cat_ar_images[0];
        this.selectedFileNames.cat_ar_images = this.data.category.cat_ar_images[0].split('/').pop();
      }
    }
  }

  save() {
    if (this.dynamicForm.invalid) {
      this.dynamicForm.markAllAsTouched();  // ✅ force all errors to show
      return;
    }

    const payload = { ...this.dynamicForm.value };

    //console.log(payload);

    if (this.editId) {
      this.updateData(payload, this.editId).subscribe();
      this.dialogRef.close(true);
    } else {
      this.saveData(payload).subscribe();
      this.dialogRef.close(true);
    }
    
  }

  saveData(data: any): Observable<any> {

    const formData = new FormData();
    formData.append('name', data.name || '');
    formData.append('name_ar', data.name_ar || '');   
    formData.append('status', data.status ? 'true' : 'false');
    formData.append('userId', localStorage.getItem('userId') || '');

    const fileControl = this.dynamicForm.get('cat_images')?.value;
    if (fileControl instanceof File) {
      formData.append('cat_images', fileControl, fileControl.name);
    }

    const fileControl1 = this.dynamicForm.get('cat_ar_images')?.value;
    if (fileControl1 instanceof File) {
      formData.append('cat_ar_images', fileControl1, fileControl1.name);
    }

    return this._masterservice.createCategory(formData, this.usertoken).pipe(
      tap(res => {
        this._toastrService.showSuccess('Category created successfully');
      }),
      catchError(err => {
        const message = err?.error?.message || err?.message;
        this._toastrService.showError(message || 'Category creation failed');
        return throwError(() => err);
      })
    );
  }

  updateData(data: any, editId: any): Observable<any> {
    const formData = new FormData();
    formData.append('name', data.name || '');
    formData.append('name_ar', data.name_ar || '');   
    formData.append('status', data.status ? 'true' : 'false');
    formData.append('userId', localStorage.getItem('userId') || '');

    const fileControl = this.dynamicForm.get('cat_images')?.value;
    if (fileControl instanceof File) {
      formData.append('cat_images', fileControl, fileControl.name);
    }

    const fileControl1 = this.dynamicForm.get('cat_ar_images')?.value;
    if (fileControl1 instanceof File) {
      formData.append('cat_ar_images', fileControl1, fileControl1.name);
    }

    return this._masterservice.updateCategory(editId, formData, this.usertoken).pipe(
      tap(res => {
        this._toastrService.showSuccess('Category updated successfully');
      }),
      catchError(err => {
        this._toastrService.showError('Category update failed');
        return throwError(() => err);
      })
    );
  }
  
  selectedFileNames: { [key: string]: string } = {};

  onFileSelected(event: Event, controlName: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
  
      this.dynamicForm.patchValue({ [controlName]: file });
      this.dynamicForm.get(controlName)?.updateValueAndValidity();
  
      this.selectedFileNames[controlName] = file.name;
  
      // ✅ Generate preview
      const reader = new FileReader();
      reader.onload = () => (this.previewUrls[controlName] = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
