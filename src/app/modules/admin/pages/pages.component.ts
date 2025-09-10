import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmdialogComponent } from '../confirmdialog/confirmdialog.component';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class PagesComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;

  constructor(private _router: Router,private dialog: MatDialog) {}
  pages = [
    {
      "id":1,
      "title": "Summer Collection",
      "title_ar": "مجموعة الصيف",
      "description": "Discover our exclusive summer collection with fresh styles and vibrant colors.",
      "description_ar": "اكتشف مجموعتنا الصيفية الحصرية مع أنماط جديدة وألوان زاهية. مثالية لهذا الموسم!",
      "pagename": "Home Page",
      "isSelected":false
    }   
  ];

  

  filteredpages() {
    return this.pages.filter(c =>
      c.pagename.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

 

  editPage(page: any, index: number) {
    //alert(banner.id);
    this._router.navigate(['/addPage', page.id]);   
  }


  public deletePage(index: number): void {
    //console.log('deleteselectedData', this.selectedIds);
  
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pages[index] = result; // 👈 update instead of push
      }
    });
    
  }

  addPages(){
    this._router.navigate(['/addPage']);
  }

   // Toggle all checkboxes
   checkUncheckAll() {
    this.pages.forEach(Page => Page.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.pages.every(Page => Page.isSelected);
  }

}



