import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { MatDialog } from '@angular/material/dialog';
import { BannersformComponent } from './bannersform/bannersform.component';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrl: './banners.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class BannersComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;
  constructor(private dialog: MatDialog) {}
  banners = [
    { id: 1, name: 'Fashion', description:"Lorem ipsum",isSelected: false},
    { id: 2, name: 'Clothing' , description:"Lorem ipsum",isSelected: false}
  ];

  filteredData() {
    return this.banners.filter(c =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editbanner(banner: any, index: number) {

    //alert(banner.id);
    const dialogRef = this.dialog.open(BannersformComponent, {
      width: '500px',
      disableClose: true,
      data: { banner }   // 👈 pass existing banner to dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.banners[index] = result; // 👈 update instead of push
      }
    });
  }

  deletebanner(banner: any) {
    alert(`Deleting ${banner.id}`);
  }

  openAddForm() {
    const dialogRef = this.dialog.open(BannersformComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.banners.push(result);  // add new banner
      }
    });
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.banners.forEach(banner => banner.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.banners.every(banner => banner.isSelected);
  }

}

