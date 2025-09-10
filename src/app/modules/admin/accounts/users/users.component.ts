import { Component,Inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';

@Component({
  selector: 'app-users',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})

export class UsersComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;
  constructor(private _router: Router,private dialog: MatDialog) {}

  users = [
    {
      "id":1,
      "firstname": "Ahmed",
      "lastname": "Khan",
      "email": "ahmed@example.com",
      "mobilenumber": "9876543210",
      "username": "johndriver",
      "password": "StrongPass123",
      "location": "New York",
      "status": "Active",
      isSelected: false
    }, 
    {
      id:2,
      "firstname": "Salman",
      "lastname": "Doe",
      "email": "salman@example.com",
      "mobilenumber": "9876543210",
      "username": "samdriver",
      "password": "StrongPass123",
      "location": "New York",
      "status": "Active",
      isSelected: false
    }
  ];

  filteredData() {
    return this.users.filter(c =>
      c.firstname.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  

  editUser(user: any, index: number) {
    //alert(banner.id);
    this._router.navigate(['/adduser', user.id]);   
  }

  public deleteUser(index: number): void {
    //console.log('deleteselectedData', this.selectedIds);
  
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.users[index] = result; // 👈 update instead of push
      }
    });
    
  }

  

  addForm(){
    this._router.navigate(['/adduser']);
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.users.forEach(User => User.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.users.every(User => User.isSelected);
  }

}