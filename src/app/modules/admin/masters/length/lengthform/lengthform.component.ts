import { Component,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../../../material.import';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-lengthform',
  standalone: true,
  imports: [MATERIAL_IMPORTS],
  templateUrl: './lengthform.component.html',
  styleUrl: './lengthform.component.scss'
})

export class LengthformComponent {
  dynamicForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<LengthformComponent>
  ) {}

  ngOnInit(): void {
    this.dynamicForm = this.fb.group({
      name: ['', Validators.required],
      name_ar: ['', Validators.required],
      status: ['Active', Validators.required]
    });

    // Prefill if editing
    if (this.data?.length) {
      this.dynamicForm.patchValue(this.data.length);
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

