import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageService } from '../../../../core/services/page.service';
import { ToastService } from '../../../../core/services/toastr.service';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { QuillModule } from 'ngx-quill';   // ✅ Import here


@Component({
  selector: 'app-pageform',
  imports: [MATERIAL_IMPORTS, QuillModule],   
  templateUrl: './pageform.component.html',
  styleUrl: './pageform.component.scss'
})
export class PageformComponent {
  pageForm: FormGroup;
  editMode = false;   // ✅ track add/edit
  pageId: string;
  editId: string | null;
  usertoken: any;
  pageDetails: any;
 
  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      [{ header: 1 }, { header: 2 }],                  // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ size: ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ color: [] }, { background: [] }],            // dropdown with defaults
      [{ font: [] }],
      [{ align: [] }],
      ['link', 'image', 'video'],
      ['clean']
    ]
  };
  
  constructor(private _router: Router,private fb: FormBuilder,private route: ActivatedRoute,private _masterservice: PageService,private _toastrService: ToastService) {}

  ngOnInit(): void {

    this.pageId = this.route.snapshot.paramMap.get('id') || '';
    console.log('page ID:', this.pageId);

    this.pageForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      title_ar: ['', [Validators.required, Validators.minLength(3)]],   
      content: ['', Validators.required],
      content_ar: ['', Validators.required],
      page_name: ['', Validators.required],
      status: [true, Validators.required]
    });

    // ✅ get id from route
    if (this.pageId) {
      this.editMode = true;
      this.editId = this.pageId;

      this._masterservice.getSpecificPage(this.pageId, this.usertoken).subscribe({
        next: (res) => {
          this.pageDetails = res.data;
          console.log('Page details:', this.pageDetails);

          if (this.pageDetails) {
            this.pageForm.patchValue({
              title: this.pageDetails.title || '',
              title_ar: this.pageDetails.title_ar || '',
              content: this.pageDetails.content || '',
              content_ar: this.pageDetails.content_ar || '',
              page_name: this.pageDetails.page_name,
              status: this.pageDetails.status
            });            
          }
        },
        error: (err) => console.error('Error fetching page details', err)
      });
    }
  }


  onSubmit() {
    
    if (this.pageForm.invalid) {
      this.pageForm.markAllAsTouched();
      return;
    }

    const payload = { ...this.pageForm.value };

    if (this.editId) {
      this.updateData(payload, this.editId).subscribe();
    } else {
      this.saveData(payload).subscribe();
    }
  }

  public saveData(data: any): Observable<any> {

    const insertData = {
       title: data.title,
       title_ar: data.title_ar,
       content:data.content,
       content_ar:data.content_ar,
       status: data.status,
       page_name:data.page_name,
       userId:localStorage.getItem('userId') 
     };
    
     return this._masterservice.createPage(insertData, this.usertoken).pipe(
       tap(res => this.handleApiResponse(res, 'Page created successfully', 'Type creation failed')),
       catchError(error => this.handleError(error, 'Page is not created. Please contact administrator'))
     );   
     
   }
   
   public updateData(data: any, editId: any): Observable<any> {    
   
    
     const updatedInfo = {
       title: data.title,
       title_ar: data.title_ar,
       content:data.content,
       content_ar:data.content_ar,
       status: data.status,
       page_name:data.page_name,
      userId:localStorage.getItem('userId') 
     };
    
     return this._masterservice.updatePage(this.editId,updatedInfo,this.usertoken).pipe(
       tap(res => this.handleApiResponse(res, 'Page updated successfully', 'Type updation failed')),
       catchError(error => this.handleError(error, 'Page is not created. Please contact administrator'))
     );   
     
   }

    // APIs for save,update,delete and multi delte

  private handleApiResponse(res: any, successMessage: string, failureMessage: string): void {
    //console.log("API Response:", res);
  
    if (res.status === true) {
      // ✅ success
      this._toastrService.showSuccess(res.msg || successMessage);
      this._router.navigate(['/pages']);
     
    } else {
      // fallback (in case API returns custom fail format)
      this._toastrService.showError(res.msg || failureMessage);
    }
  }
  
  
  private handleError(error: any, fallbackMessage: string): Observable<any> {
    console.error("API Error:", error);
  
    const message =
      error?.error?.message ||   // backend-provided message
      error?.message ||          // Angular HttpErrorResponse message
      fallbackMessage;           // fallback
  
    this._toastrService.showError(message);
  
    return throwError(() => error);
  }

  // helper for template
  get f() {
    return this.pageForm.controls;
  }

  onContentChanged(event: any, controlName: string) {
    const content = event.editor.getText().trim(); // get plain text for validation
    this.pageForm.get(controlName)?.setValue(content); // update form control
    this.pageForm.get(controlName)?.markAsTouched(); // mark touched for validation
  }
  
  
  onCancel() {
    this.pageForm.reset({ status: 'Active' });
    this._router.navigate(['/pages']);
  }  
}
