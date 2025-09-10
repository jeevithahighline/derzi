import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';

@Component({
  selector: 'app-emailtemplates',
  templateUrl: './emailtemplates.component.html',
  styleUrl: './emailtemplates.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class EmailtemplatesComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;

  constructor(private _router: Router,private dialog: MatDialog) {}
  
  templates = [
    { 
      id: 1, 
      templatename: 'Registration',
      title: 'Derzi - Registration',
      title_ar: 'ديرزي - التسجيل',
      description: 'Please read the below instructions carefully before completing your registration.',
      description_ar: 'يرجى قراءة التعليمات أدناه بعناية قبل إكمال التسجيل.',
      status: 'Active',
      isSelected: false
    },
    { 
      id: 2, 
      templatename: 'Login',
      title: 'Derzi - Login',
      title_ar: 'ديرزي - تسجيل الدخول',
      description: 'Please login using the credentials provided to you via email.',
      description_ar: 'يرجى تسجيل الدخول باستخدام بيانات الاعتماد المرسلة إلى بريدك الإلكتروني.',
      status: 'Inactive',
      isSelected: false
    },
    { 
      id: 3, 
      templatename: 'Password Reset',
      title: 'Derzi - Password Reset',
      title_ar: 'ديرزي - إعادة تعيين كلمة المرور',
      description: 'Click the link below to reset your password. This link will expire in 24 hours.',
      description_ar: 'انقر على الرابط أدناه لإعادة تعيين كلمة المرور الخاصة بك. سينتهي صلاحية الرابط خلال 24 ساعة.',
      status: 'Active',
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
    this._router.navigate(['/addemailtemplate', template.id]);   
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
    this._router.navigate(['/addemailtemplate']);
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




