import { Component,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../../../material.import';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-roleform',
  standalone: true,
  imports: [MATERIAL_IMPORTS],
  templateUrl: './roleform.component.html',
  styleUrl: './roleform.component.scss'
})

export class RoleformComponent {
  dynamicForm: FormGroup;

  constructor(
    private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<RoleformComponent>
  ) {}

  ngOnInit(): void {
    this.dynamicForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      status: ['Active', Validators.required]
    });

    // Prefill if editing
    if (this.data?.role) {
      this.dynamicForm.patchValue(this.data.role);
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
