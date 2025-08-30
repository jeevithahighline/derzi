import { Component,Inject,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../../../material.import';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-bannersform',
  standalone: true,
  imports: [MATERIAL_IMPORTS],
  templateUrl: './bannersform.component.html',
  styleUrl: './bannersform.component.scss'
})

export class BannersformComponent implements OnInit{
  dynamicForm: FormGroup;
  selectedFileName = '';
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<BannersformComponent>
  ) {}

  ngOnInit(): void {
    this.dynamicForm = this.fb.group({
      name: ['', Validators.required],
      name_ar: ['', Validators.required],
      description: ['', Validators.required],
      description_ar: ['', Validators.required],
      image: [null, Validators.required],
      status: ['Active', Validators.required]
    });

    // Prefill if editing
    if (this.data?.banner) {
      this.dynamicForm.patchValue(this.data.banner);
    }
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

