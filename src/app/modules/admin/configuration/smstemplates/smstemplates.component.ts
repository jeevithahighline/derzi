import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';

@Component({
  selector: 'app-smstemplates',
  templateUrl: './smstemplates.component.html',
  styleUrl: './smstemplates.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class SmstemplatesComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;

  constructor(private _router: Router,private dialog: MatDialog) {}
 
  templates = [
    { 
      id: 1, 
      templatename: 'OTP',
      title: 'Derzi - OTP',
      title_ar: 'ديرزي - التسجيل',
      description: 'Please check the OTP',
      description_ar: 'يرجى قراءة التعليمات أدناه بعناية قبل إكمال التسجيل.',
      status: 'Active',
      isSelected: false
    },
    { 
      id: 2, 
      templatename: 'Registration Success',
      title: 'Derzi - Account Verification',
      title_ar: 'ديرزي - تسجيل الدخول',
      description: 'Your Account is verified successfully',
      description_ar: 'يرجى تسجيل الدخول باستخدام بيانات الاعتماد المرسلة إلى بريدك الإلكتروني.',
      status: 'Inactive',
      isSelected: false
    }
  ];

  filteredtemplates() {
    return this.templates.filter(c =>
      c.templatename.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  edittemplates(template: any, index: number) {
    //alert(banner.id);
    this._router.navigate(['/addsmstemplate', template.id]);   
  }

  public deletetemplates(index: number): void {
    //console.log('deleteselectedData', this.selectedIds);
  
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.templates[index] = result; // 👈 update instead of push
      }
    });
    
  }

  addTemplates(){
    this._router.navigate(['/addsmstemplate']);
  }

   // Toggle all checkboxes
   checkUncheckAll() {
    this.templates.forEach(templates => templates.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.templates.every(templates => templates.isSelected);
  }

}





