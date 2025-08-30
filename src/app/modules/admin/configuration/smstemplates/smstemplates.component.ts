import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';

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

  constructor(private _router: Router) {}
  templates = [
    { id: 1, templatename: 'OTP Message',message:'Please use the OTP',isSelected: false},
    { id: 2, templatename: 'Verification Message',message:'Please use the verification code' ,isSelected: false}
  ];

  filteredtemplates() {
    return this.templates.filter(c =>
      c.templatename.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  edittemplates(templates: any) {
    //alert(`Editing ${templates.name}`);
  }

  deletetemplates(templates: any) {
    //alert(`Deleting ${templates.name}`);
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





