import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../../../material.import';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-bannersform',
  standalone: true,
  imports: [MATERIAL_IMPORTS],
  templateUrl: './bannersform.component.html',
  styleUrl: './bannersform.component.scss'
})

export class BannersformComponent {
  dynamicForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BannersformComponent>
  ) {
    this.dynamicForm = this.fb.group({
      name: ['', Validators.required],
      name_ar: ['', Validators.required],
      description: ['', Validators.required],
      description_ar: ['', Validators.required],
      image: [null, Validators.required],
      status: ['Active', Validators.required]
    });
  }

  save() {
    if (this.dynamicForm.invalid) {
      this.dynamicForm.markAllAsTouched();  // ✅ force all errors to show
      return;
    }
    this.dialogRef.close(this.dynamicForm.value);
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.dynamicForm.patchValue({ image: file });
      this.dynamicForm.get('image')?.updateValueAndValidity();
    }
  }
  
  

  close() {
    this.dialogRef.close();
  }
}

