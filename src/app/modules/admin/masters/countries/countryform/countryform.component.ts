import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../../../material.import';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-countryform',
  standalone: true,
  imports: [MATERIAL_IMPORTS],
  templateUrl: './countryform.component.html',
  styleUrls: ['./countryform.component.scss']
})
export class CountryformComponent {
  countryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CountryformComponent>
  ) {
    this.countryForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      flag: [''],
      status: ['Active', Validators.required]
    });
  }

  save() {
    if (this.countryForm.valid) {
      this.dialogRef.close(this.countryForm.value); // send data back
    }
  }

  close() {
    this.dialogRef.close();
  }
}
