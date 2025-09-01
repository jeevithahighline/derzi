import { Component,Inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { MatDialog } from '@angular/material/dialog';
import { FabricformComponent } from './fabricform/fabricform.component';
@Component({
  selector: 'app-fabric',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './fabric.component.html',
  styleUrl: './fabric.component.scss'
})

export class FabricComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;
  constructor(private dialog: MatDialog) {}

  fabrics = [
    { id: 1, name: 'Cotton',isSelected: false},
    { id: 2, name: 'Silk' ,isSelected: false}
  ];

  filteredData() {
    return this.fabrics.filter(c =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editfabric(fabric: any, index: number) {

    //alert(banner.id);
    const dialogRef = this.dialog.open(FabricformComponent, {
      width: '500px',
      disableClose: true,
      data: { fabric }   // 👈 pass existing banner to dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fabrics[index] = result; // 👈 update instead of push
      }
    });
  }

  deletefabric(fabric: any) {
    //alert(`Deleting ${fabric.name}`);
  }

  openAddForm() {
    const dialogRef = this.dialog.open(FabricformComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fabrics.push(result);  // add new fabric
      }
    });
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.fabrics.forEach(fabric => fabric.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.fabrics.every(fabric => fabric.isSelected);
  }

}

