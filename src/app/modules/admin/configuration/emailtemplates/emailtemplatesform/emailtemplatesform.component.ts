import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TemplatesService } from '../../../../../core/services/templates.service';
import { ToastService } from '../../../../../core/services/toastr.service';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MATERIAL_IMPORTS } from '../../../../material.import';
import { QuillModule } from 'ngx-quill';   // ✅ Import here
@Component({
  selector: 'app-emailtemplatesform',
  imports: [MATERIAL_IMPORTS, QuillModule],   // ✅ just one line
  templateUrl: './emailtemplatesform.component.html',
  styleUrl: './emailtemplatesform.component.scss'
})
export class EmailtemplatesformComponent {
  templateForm: FormGroup;
  editMode = false;   // ✅ track add/edit
  templateId: string;
  editId: string | null;
  usertoken: any;
  templateDetails: any; 
  
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
      ['link', 'image', 'video','code'],
      ['clean']
    ]
  };  

  constructor(private _router: Router,private fb: FormBuilder,private route: ActivatedRoute,private _masterservice: TemplatesService,private _toastrService: ToastService) {}

  ngOnInit(): void {

    this.templateId = this.route.snapshot.paramMap.get('id') || '';
    console.log('templateId ID:', this.templateId);

    this.templateForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      title_ar: ['', [Validators.required, Validators.minLength(3)]],   
      content: ['', Validators.required],
      content_ar: ['', Validators.required],
      templatename: ['', Validators.required],
      status: [true, Validators.required]
    });  

    // ✅ get id from route
    if (this.templateId) {
      this.editMode = true;
      this.editId = this.templateId;

      this._masterservice.getSpecificTemplates(this.templateId, this.usertoken).subscribe({
        next: (res) => {
          this.templateDetails = res.data;
          console.log('Page details:', this.templateDetails);

          if (this.templateDetails) {
            this.templateForm.patchValue({
              title: this.templateDetails.title || '',
              title_ar: this.templateDetails.title_ar || '',
              content: this.templateDetails.content || '',
              content_ar: this.templateDetails.content_ar || '',
              templatename: this.templateDetails.templatename,
              status: this.templateDetails.status
            });            
          }
        },
        error: (err) => console.error('Error fetching template details', err)
      });
    }
    
  }

  

  saveTemplate() {
    
    if (this.templateForm.invalid) {
      this.templateForm.markAllAsTouched();
      return;
    }

    const payload = { ...this.templateForm.value };

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
       templatename:data.templatename,
       userId:localStorage.getItem('userId') 
     };
    
     return this._masterservice.createTemplates(insertData, this.usertoken).pipe(
       tap(res => this.handleApiResponse(res, 'Template created successfully', 'Template creation failed')),
       catchError(error => this.handleError(error, 'Template is not created. Please contact administrator'))
     );   
     
   }
   
   public updateData(data: any, editId: any): Observable<any> {    
   
    
     const updatedInfo = {
      title: data.title,
      title_ar: data.title_ar,
      content:data.content,
      content_ar:data.content_ar,
      status: data.status,
      templatename:data.templatename,
      userId:localStorage.getItem('userId') 
     };
    
     return this._masterservice.updateTemplates(this.editId,updatedInfo,this.usertoken).pipe(
       tap(res => this.handleApiResponse(res, 'Template updated successfully', 'Type updation failed')),
       catchError(error => this.handleError(error, 'Template is not created. Please contact administrator'))
     );   
     
   }

    // APIs for save,update,delete and multi delte

  private handleApiResponse(res: any, successMessage: string, failureMessage: string): void {
    //console.log("API Response:", res);
  
    if (res.status === true) {
      // ✅ success
      this._toastrService.showSuccess(res.msg || successMessage);
      this._router.navigate(['/emailtemplates']);
     
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
    return this.templateForm.controls;
  }
 


  onCancel() {
    this.templateForm.reset({ status: 'Active' });
    this._router.navigate(['/emailtemplates']);
  }  
}

