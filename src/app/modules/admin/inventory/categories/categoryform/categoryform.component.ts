import { Component,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../../../material.import';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-categoryform',
  standalone: true,
  imports: [MATERIAL_IMPORTS],
  templateUrl: './categoryform.component.html',
  styleUrl: './categoryform.component.scss'
})

export class CategoryformComponent {
  dynamicForm: FormGroup;

  constructor(
    private fb: FormBuilder,@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CategoryformComponent>
  ) {}

  ngOnInit(): void {
    this.dynamicForm = this.fb.group({
      name: ['', Validators.required],
      name_ar: ['', Validators.required],
      status: ['Active', Validators.required]
    });

    // Prefill if editing
    if (this.data?.category) {
      this.dynamicForm.patchValue(this.data.category);
    }
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
