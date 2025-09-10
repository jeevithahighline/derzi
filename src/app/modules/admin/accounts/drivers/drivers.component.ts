import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';

@Component({
  selector: 'app-drivers',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './drivers.component.html',
  styleUrl: './drivers.component.scss'
})

export class DriversComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;

  constructor(private _router: Router,private dialog: MatDialog) {}
  
  drivers = [
    {
      "id":1,
      "firstname": "John",
      "lastname": "Doe",
      "email": "johndoe@example.com",
      "mobilenumber": "9876543210",
      "username": "johndriver",
      "password": "StrongPass123",
      "location": "New York",
      "status": "Active",
      isSelected: false
    }, 
    {
      id:2,
      "firstname": "Sameem",
      "lastname": "Doe",
      "email": "sameem@example.com",
      "mobilenumber": "9876543210",
      "username": "samdriver",
      "password": "StrongPass123",
      "location": "New York",
      "status": "Active",
      isSelected: false
    }
  ];

  filtereddrivers() {
    return this.drivers.filter(c =>
      c.firstname.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

 
  editdriver(driver: any, index: number) {
    //alert(banner.id);
    this._router.navigate(['/adddriver', driver.id]);   
  }

  public deletedriver(index: number): void {
    //console.log('deleteselectedData', this.selectedIds);
  
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.drivers[index] = result; // 👈 update instead of push
      }
    });
    
  }

  addForm(){
    this._router.navigate(['/adddriver']);
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.drivers.forEach(driver => driver.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.drivers.every(driver => driver.isSelected);
  }


}

