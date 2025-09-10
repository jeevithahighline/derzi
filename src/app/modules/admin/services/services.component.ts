import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmdialogComponent } from '../confirmdialog/confirmdialog.component';

@Component({
  selector: 'app-services',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})

export class ServicesComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;
  services = [
    { id: 1, name: 'Embroidery',name_ar:'مجموعة الصيف',category:'Stitching',description:'details of what’s included',duration:'2 days',isSelected: false},
    { id: 2, name: 'Blouse Design',name_ar:'مجموعة الصيف' ,category:'Embroidery',description:'details of what’s included',duration:'2 weeks',isSelected: false}
  ];

  constructor(private _router: Router,private dialog: MatDialog,) {}

  filteredData() {
    return this.services.filter(c =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

 
  editservice(service: any, index: number) {

    //alert(banner.id);
    this._router.navigate(['/addservice', service.id]);

   
  }

   public deleteservice(index: number): void {
    //console.log('deleteselectedData', this.selectedIds);
  
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.services[index] = result; // 👈 update instead of push
      }
    });
    
  }

  addService(){
    this._router.navigate(['/addservice']);
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.services.forEach(service => service.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.services.every(service => service.isSelected);
  }
  

}


