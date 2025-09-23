import { Component,Inject,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../../../material.import';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PromocodeService } from '../../../../../core/services/promocode.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../../../core/services/toastr.service';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';


@Component({
  selector: 'app-promocode-form',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './promocodeform.component.html',
  styleUrls: ['./promocodeform.component.scss']
})
export class PromocodeformComponent implements OnInit {
  promocodeForm!: FormGroup;
  editMode = false;   // ✅ track add/edit
  promocodeId: number | null = null;
  editId:any;
  merchants: any[] = [];
  categories: any[] = [];
  products : any[] = [];
  usertoken: any;
  promoId:any;
  promoDetails:any;

  constructor(private fb: FormBuilder,private _router: Router,private route: ActivatedRoute,private _promoservice: PromocodeService,private _toastrService: ToastService) {}
 

  ngOnInit(): void {

    this.usertoken = localStorage.getItem('usertoken');
    this.loadDropdownData();

    this.promoId = this.route.snapshot.paramMap.get('id') || '';

    this.promocodeForm = this.fb.group({
      code: ['', Validators.required],
      discountType: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: [true],
      isGlobal: [false],
      productIds: [[]],       // Multi-select array
      categoryIds: [[]],      // Multi-select array
      merchantIds: [[]],      // Multi-select array
    });

     // 🔹 Subscribe to isGlobal changes
    this.promocodeForm.get('isGlobal')?.valueChanges.subscribe((val) => {
      if (val) {
        this.promocodeForm.patchValue({
          productIds: [],
          categoryIds: [],
          merchantIds: [],
        });
        this.promocodeForm.get('productIds')?.disable();
        this.promocodeForm.get('categoryIds')?.disable();
        this.promocodeForm.get('merchantIds')?.disable();
      } else {
        this.promocodeForm.get('productIds')?.enable();
        this.promocodeForm.get('categoryIds')?.enable();
        this.promocodeForm.get('merchantIds')?.enable();
      }
    });

    if (this.promoId) {
      this.editMode = true;
      this.editId = this.promoId;

      this._promoservice.getSpecificPromocode(this.promoId, this.usertoken).subscribe({
        next: (res) => {
          this.promoDetails = res.data;
          console.log('Promo details:', this.promoDetails);

          if (this.promoDetails) {
            this.promocodeForm.patchValue({
              code: this.promoDetails.code || '',
              discountType: this.promoDetails.discountType || '', // ✅ note: API returns `discounttype`
              amount: this.promoDetails.amount || 0,
              startDate: this.promoDetails.startDate ? new Date(this.promoDetails.startDate) : '',
              endDate: this.promoDetails.endDate ? new Date(this.promoDetails.endDate) : '',
              status: this.promoDetails.status ?? true,
              maxUsage: this.promoDetails.maxUsage || 1,
              usageCount: this.promoDetails.usageCount || 0,
              maxUsagePerUser: this.promoDetails.maxUsagePerUser || 1,
              minPurchaseAmount: this.promoDetails.minPurchaseAmount || 0,
              isGlobal: this.promoDetails.isGlobal || false,
              productIds: this.promoDetails.productIds || [],
              categoryIds: this.promoDetails.categoryIds || [],
              merchantIds: this.promoDetails.merchantIds || [],
            });

           
          }
        },
        error: (err) => console.error('Error fetching banner details', err)
      });
    }
     
  }

  loadDropdownData(): void {
    this._promoservice.getAllMerchants(this.usertoken).subscribe(res => this.merchants = res.data.docs);
    this._promoservice.getAllCategories(this.usertoken).subscribe(res => this.categories = res.data.docs);
    this._promoservice.getAllProducts(this.usertoken).subscribe(res => this.products = res.data.products);
    
  }


  onSubmit() {
    if (this.promocodeForm.valid) {
      console.log('Form Data:', this.promocodeForm.value);

      const payload = { ...this.promocodeForm.value };

      if (this.promoId) {
        this.updateData(payload, this.promoId).subscribe();
      } else {
        this.saveData(payload).subscribe();
      }
      
    } else {
      this.promocodeForm.markAllAsTouched();
    }
  }

  public saveData(data: any): Observable<any> {

  
    const insertData = {
      code: data.code,
      discountType: data.discountType,
      amount: data.amount,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
      isGlobal: data.isGlobal,
    
      // Optional targeting arrays → send empty if global
      productIds: data.isGlobal ? [] : data.productIds || [],
      categoryIds: data.isGlobal ? [] : data.categoryIds || [],
      merchantIds: data.isGlobal ? [] : data.merchantIds || [],
    
    
      // Attach user (if you’re storing who created it)
      userId: localStorage.getItem("userId")
    };
    
    
     return this._promoservice.createPromocode(insertData, this.usertoken).pipe(
       tap(res => this.handleApiResponse(res, 'Page created successfully', 'Type creation failed')),
       catchError(error => this.handleError(error, 'Page is not created. Please contact administrator'))
     );   
     
   }

   public updateData(data: any, editId: any): Observable<any> {    
   
    
    const updatedInfo = {
      code: data.code,
      discountType: data.discountType,
      amount: data.amount,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
      isGlobal: data.isGlobal,
    
      // Optional targeting arrays → send empty if global
      productIds: data.isGlobal ? [] : data.productIds || [],
      categoryIds: data.isGlobal ? [] : data.categoryIds || [],
      merchantIds: data.isGlobal ? [] : data.merchantIds || [],
    
    
      // Attach user (if you’re storing who created it)
      userId: localStorage.getItem("userId")
    };
   
    return this._promoservice.updatePromocode(this.promoId,updatedInfo,this.usertoken).pipe(
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
     this._router.navigate(['/promocode']);
    
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

  onCancel(){
    this._router.navigate(['/promocode']);
  }
}
