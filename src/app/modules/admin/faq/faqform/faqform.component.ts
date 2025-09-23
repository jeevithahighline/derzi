import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FaqService } from '../../../../core/services/faq.service';
import { ToastService } from '../../../../core/services/toastr.service';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MATERIAL_IMPORTS } from '../../../material.import';

@Component({
  selector: 'app-faqform',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './faqform.component.html',
  styleUrl: './faqform.component.scss'
})
export class FaqformComponent {

  faqForm: FormGroup;
  editMode = false;   // ✅ track add/edit
  faqId: string;
  editId: string | null;
  usertoken: any;
  faqDetails: any;

  constructor(private _router: Router,private fb: FormBuilder,private route: ActivatedRoute,private _masterservice: FaqService,private _toastrService: ToastService) {}

 
  

  ngOnInit(): void {

    this.faqId = this.route.snapshot.paramMap.get('id') || '';
    console.log('page ID:', this.faqId);
    
    this.faqForm = this.fb.group({
      question: ['', [Validators.required, Validators.minLength(3)]],
      question_ar: ['', [Validators.required, Validators.minLength(3)]],   
      answer: ['', [Validators.required, Validators.maxLength(250)]],
      answer_ar: ['', [Validators.required, Validators.maxLength(250)]],
      status: [true, Validators.required]    
    });

     // ✅ get id from route
    if (this.faqId) {
      this.editMode = true;
      this.editId = this.faqId;

      this._masterservice.getSpecificFaq(this.faqId, this.usertoken).subscribe({
        next: (res) => {
          this.faqDetails = res.data;
          console.log('Page details:', this.faqDetails);

          if (this.faqDetails) {
            this.faqForm.patchValue({
              question: this.faqDetails.question || '',
              question_ar: this.faqDetails.question_ar || '',
              answer: this.faqDetails.answer || '',
              answer_ar: this.faqDetails.answer_ar || '',
              status: this.faqDetails.status
            });            
          }
        },
        error: (err) => console.error('Error fetching page details', err)
      });
    }  
  }

 

 

  saveFaq() {
    
    if (this.faqForm.invalid) {
      this.faqForm.markAllAsTouched();
      return;
    }

    const payload = { ...this.faqForm.value };

    if (this.editId) {
      this.updateData(payload, this.editId).subscribe();
    } else {
      this.saveData(payload).subscribe();
    }
  }

  public saveData(data: any): Observable<any> {

    const insertData = {
      question: data.question,
       question_ar: data.question_ar,
       answer:data.answer,
       answer_ar:data.answer,
       status: data.status,
       page_name:data.page_name,
       userId:localStorage.getItem('userId') 
     };
    
     return this._masterservice.createFaq(insertData, this.usertoken).pipe(
       tap(res => this.handleApiResponse(res, 'Page created successfully', 'Type creation failed')),
       catchError(error => this.handleError(error, 'Page is not created. Please contact administrator'))
     );   
     
   }
   
   public updateData(data: any, editId: any): Observable<any> {    
   
    
     const updatedInfo = {
       question: data.question,
       question_ar: data.question_ar,
       answer:data.answer,
       answer_ar:data.answer,
       status: data.status,
       page_name:data.page_name,
       userId:localStorage.getItem('userId') 
     };
    
     return this._masterservice.updateFaq(this.editId,updatedInfo,this.usertoken).pipe(
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
      this._router.navigate(['/faq']);
     
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
    return this.faqForm.controls;
  }

  

  onCancel() {
    this.faqForm.reset({ status: 'Active' });
    this._router.navigate(['/faq']);
  }  
}

