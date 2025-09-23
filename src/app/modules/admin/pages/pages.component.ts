import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmdialogComponent } from '../confirmdialog/confirmdialog.component';
import { PageService } from '../../../core/services/page.service';
import { ToastService } from '../../../core/services/toastr.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class PagesComponent {
  searchText = '';
  totalItems = 0;
  masterSelected: boolean = false;
  page = 1;
  pageSize = 10;
  pageIndex = 0;
  usertoken:any;
  selectedIds: string[] = [];

  constructor(private _router: Router,private dialog: MatDialog,private _pageService: PageService,private _toastrService: ToastService) {}
  pages: any[] = [];

  ngOnInit(): void {
    this.loadPages();
  }

  loadPages(page: number = this.page, size: number = this.pageSize) {
    const token = localStorage.getItem('usertoken'); 
    if (token) {
      this._pageService.getAllPage(token, this.page, this.pageSize).subscribe({
        next: (res: any) => {
          this.pages = res.data.docs || [];
          this.totalItems = res.data.totalDocs || 0;  // backend must return total count
          this.page = res.data.page || page;
          this.pageSize = res.data.limit || size;
        },
        error: (err) => {
          console.error('Error fetching banners', err);
        }
      });
    }
  }

  filteredpages() {
    return this.pages.filter(c =>
      c.title.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

 

  editPage(page: any, index: number) {
    //alert(banner.id);
    this._router.navigate(['/addPage', page._id]);   
  }


  deletePage(data) {

    this.selectedIds = data._id;
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // ✅ Call delete API
        this._pageService.deletePage(this.selectedIds,this.usertoken).subscribe({
          next: () => {
            this._toastrService.showSuccess("Deleted Successfully");
            this.loadPages(); // refresh table
          },
          error: () => {
            this._toastrService.showError("Deletion failed");
          }
        });
      } else {
        this._toastrService.showError("Deletion cancelled by user");
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

  onPageChange(event: any) {
    this.page = event.pageIndex + 1;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPages(this.page, this.pageSize);
  }

}



