import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../../../material.import';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-brandform',
  standalone: true,
  imports: [MATERIAL_IMPORTS],
  templateUrl: './brandform.component.html',
  styleUrl: './brandform.component.scss'
})

export class BrandformComponent {
  dynamicForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BrandformComponent>
  ) {
    this.dynamicForm = this.fb.group({
      name: ['', Validators.required],
      name_ar: ['', Validators.required],
      description: ['', Validators.required],
      description_ar: ['', Validators.required],
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
  

  close() {
    this.dialogRef.close();
  }
}
