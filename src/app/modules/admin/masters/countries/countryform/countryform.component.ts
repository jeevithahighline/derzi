import { Component,Inject,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../../../material.import';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-countryform',
  standalone: true,
  imports: [MATERIAL_IMPORTS],
  templateUrl: './countryform.component.html',
  styleUrls: ['./countryform.component.scss']
})
export class CountryformComponent {
  dynamicForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CountryformComponent>
  ) {}

  ngOnInit(): void {
    this.dynamicForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      flag: [''],
      status: ['Active', Validators.required]
    });

    // Prefill if editing
    if (this.data?.country) {
      this.dynamicForm.patchValue(this.data.country);
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
