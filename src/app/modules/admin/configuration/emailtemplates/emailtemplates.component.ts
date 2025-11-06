import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { MatDialog } from '@angular/material/dialog';
import { Router,ActivatedRoute  } from '@angular/router';
import { ConfirmdialogComponent } from '../../confirmdialog/confirmdialog.component';
import { TemplatesService } from '../../../../core/services/templates.service';
import { ToastService } from '../../../../core/services/toastr.service';

@Component({
  selector: 'app-emailtemplates',
  templateUrl: './emailtemplates.component.html',
  styleUrl: './emailtemplates.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class EmailtemplatesComponent {
  searchText = '';
  totalItems = 0;
  masterSelected: boolean = false;
  page = 1;
  pageSize = 10;
  pageIndex = 0;
  usertoken:any;
  selectedIds: string[] = [];

  constructor(private _router: Router,private dialog: MatDialog,private _commonService: TemplatesService,private _toastrService: ToastService) {}
  templates: any[] = [];

  ngOnInit(): void {
    this.loadTemplates();
  }

  loadTemplates(page: number = this.page, size: number = this.pageSize) {
    const token = localStorage.getItem('usertoken'); 
    if (token) {
      this._commonService.getAllTemplates(token, this.page, this.pageSize).subscribe({
        next: (res: any) => {
          this.templates = res.data.docs || [];
          this.totalItems = res.data.totalDocs || 0;  // backend must return total count
          this.page = res.data.page || page;
          this.pageSize = res.data.limit || size;
        },
        error: (err) => {
          console.error('Error fetching template', err);
        }
      });
    }
  }

  filteredtemplates() {
    return this.templates.filter(c =>
      c.title.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

 

  edittemplates(template: any, index: number) {
    //alert(banner.id);
    this._router.navigate(['/addemailtemplate', template._id]);   
  }


  deletetemplates(data) {

    this.selectedIds = data._id;
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // ✅ Call delete API
        this._commonService.deleteTemplates(this.selectedIds,this.usertoken).subscribe({
          next: () => {
            this._toastrService.showSuccess("Deleted Successfully");
            this.loadTemplates(); // refresh table
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

  deleteSelected() {
    const selectedIds = this.templates.filter(item => item.isSelected).map(item => item._id);
  
    if (selectedIds.length === 0) {
      this._toastrService.showError("Please select at least one record to delete.");
      return;
    }
  
    // ✅ Confirmation popup
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '450px',
      height: '250px',
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // ✅ Prepare request body
        const requestBody = { deleteIds: selectedIds };
  
        // ✅ Call multi-delete API
        this._commonService.deleteMultipleData(requestBody, this.usertoken).subscribe({
          next: () => {
            this._toastrService.showSuccess("Selected template deleted successfully");
            this.loadTemplates(); // refresh table
          },
          error: () => {
            this._toastrService.showError("Failed to delete selected template");
          }
        });
      } else {
        this._toastrService.showError("Deletion cancelled by user");
      }
    });
  }

  addTemplates(){
    this._router.navigate(['/addemailtemplate']);
  }

   // Toggle all checkboxes
   checkUncheckAll() {
    this.templates.forEach(Page => Page.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.templates.every(Page => Page.isSelected);
  }

  onPageChange(event: any) {
    this.page = event.pageIndex + 1;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTemplates(this.page, this.pageSize);
  }

}






