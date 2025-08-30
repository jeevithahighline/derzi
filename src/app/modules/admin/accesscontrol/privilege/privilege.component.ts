import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';
@Component({
  selector: 'app-privilege',
  templateUrl: './privilege.component.html',
  styleUrl: './privilege.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class PrivilegeComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;

  constructor(private _router: Router) {}
  
  privileges = [
    { id: 1, name: 'Super Admin', description:"Access for Super Admin - Owner of Derzi",rolename:"Superadmin",groupname:"Superadmin",isSelected: false},
    { id: 2, name: 'Merchants' , description:"Access for Merchants",rolename:"Merchants",groupname:"Superadmin",isSelected: false}
  ];

  filteredData() {
    return this.privileges.filter(c =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editprivilege(privilege: any) {
    //alert(`Editing ${privilege.name}`);
  }

  deleteprivilege(privilege: any) {
    //alert(`Deleting ${privilege.name}`);
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.privileges.forEach(privilege => privilege.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.privileges.every(privilege => privilege.isSelected);
  }

  openAddForm() {
    this._router.navigate(['/addprivileges']);
  }

}



