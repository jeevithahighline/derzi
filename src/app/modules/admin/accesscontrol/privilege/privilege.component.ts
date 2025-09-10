import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';

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

  constructor(private _router: Router,private dialog: MatDialog) {}
  
  privileges = [
    { id: 1, name: 'Super Admin', description:"Access for Super Admin - Owner of Derzi",rolename:"Superadmin",groupname:"Superadmin",isSelected: false},
    { id: 2, name: 'Manager' , description:"Access for Transactions",rolename:"Manager",groupname:"Manager",isSelected: false}
  ];

  filteredData() {
    return this.privileges.filter(c =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  

  editprivilege(privilege: any, index: number) {
    //alert(banner.id);
    this._router.navigate(['/addprivileges', privilege.id]);   
  }


  public deleteprivilege(index: number): void {
    //console.log('deleteselectedData', this.selectedIds);
  
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.privileges[index] = result; // 👈 update instead of push
      }
    });
    
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



