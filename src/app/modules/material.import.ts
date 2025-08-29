import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';   // ✅ use Module, not Directive
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select'; // ✅ needed for <mat-select>
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; 
import { MatMenuModule } from '@angular/material/menu';


export const MATERIAL_IMPORTS = [
  CommonModule,
  FormsModule,
  MatMenuModule,
  MatDatepickerModule,
  MatNativeDateModule,
  ReactiveFormsModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,   // ✅ make sure select is here
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,     // ✅ corrected
  MatButtonModule,
  MatIconModule,
  MatDialogModule
];
