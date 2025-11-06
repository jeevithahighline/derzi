import { MATERIAL_IMPORTS } from '../../../../material.import';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PromotionService } from '../../../../../core/services/promotion.service';
import { ToastService } from '../../../../../core/services/toastr.service';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-promotion-form',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './promotionform.component.html',
  styleUrls: ['./promotionform.component.scss']
})
export class PromotionformComponent implements OnInit {
  promotionForm!: FormGroup;
  editMode = false;
  promoId: string | null = null;
  products: any[] = [];
  usertoken: any;

  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private route: ActivatedRoute,
    private _promoservice: PromotionService,
    private _toastrService: ToastService
  ) {}

  ngOnInit(): void {
    this.usertoken = localStorage.getItem('usertoken');
    this.promoId = this.route.snapshot.paramMap.get('id') || null;

    this.loadProducts();

    this.promotionForm = this.fb.group({
      promotionName: ['', Validators.required],
      description: ['', Validators.required],
      type: ['manual', Validators.required],
      manualProductIds: [[]],
      dynamicRule: this.fb.group({
        ruleType: [''],
        timePeriod: ['']
      }),
      status: [true, Validators.required]
    });

    // 🔹 Watch type change
    this.promotionForm.get('type')?.valueChanges.subscribe((val) => {
      if (val === 'manual') {
        this.promotionForm.get('manualProductIds')?.enable();
        this.promotionForm.get('dynamicRule')?.disable();
      } else {
        this.promotionForm.get('manualProductIds')?.disable();
        this.promotionForm.get('dynamicRule')?.enable();
      }
    });

    // Initial disable logic
    if (this.promotionForm.get('type')?.value === 'manual') {
      this.promotionForm.get('dynamicRule')?.disable();
    }

    // If editing existing promotion
    if (this.promoId) {
      this.editMode = true;
      this._promoservice.getSpecificPromotion(this.promoId, this.usertoken).subscribe({
        next: (res) => {
          const data = res.data;
          this.promotionForm.patchValue({
            promotionName: data.promotionName,
            description: data.description,
            type: data.type,
            manualProductIds: data.manualProductIds || [],
            dynamicRule: data.dynamicRule || { ruleType: '', timePeriod: '' },
            status: data.status,
            priority: data.priority
          });

          if (data.type === 'manual') {
            this.promotionForm.get('manualProductIds')?.enable();
            this.promotionForm.get('dynamicRule')?.disable();
          } else {
            this.promotionForm.get('manualProductIds')?.disable();
            this.promotionForm.get('dynamicRule')?.enable();
          }
        },
        error: (err) => console.error('Error fetching promo details:', err)
      });
    }
  }

  loadProducts(): void {
    this._promoservice.getAllProducts(this.usertoken).subscribe({
      next: (res) => (this.products = res.data.products),
      error: (err) => console.error('Error loading products', err)
    });
  }

  onSubmit() {
    if (this.promotionForm.invalid) {
      this.promotionForm.markAllAsTouched();
      return;
    }

    const formValue = this.promotionForm.value;
    let payload: any;

    if (formValue.type === 'manual') {
      payload = {
        promotionName: formValue.promotionName,
        description: formValue.description,
        type: 'manual',
        manualProductIds: formValue.manualProductIds || [],
        status: formValue.status,
        priority: 1
      };
    } else {
      payload = {
        promotionName: formValue.promotionName,
        description: formValue.description,
        type: 'dynamic',
        dynamicRule: formValue.dynamicRule,
        status: formValue.status,
        priority: 1
      };
    }

    if (this.editMode && this.promoId) {
      this.updateData(payload, this.promoId).subscribe();
    } else {
      this.saveData(payload).subscribe();
    }
  }

  saveData(data: any): Observable<any> {
    return this._promoservice.createPromotion(data, this.usertoken).pipe(
      tap(res => {
        console.log('📦 Raw API Response:', res);  // 👈 Add this line
        this.handleApiResponse(res, 'Promotion created successfully', 'Promotion creation failed');
      }),
      catchError(error => this.handleError(error, 'Promocode is not created. Please contact administrator'))
    );
  }
  

  updateData(data: any, id: string): Observable<any> {
    return this._promoservice.updatePromotion(id, data, this.usertoken).pipe(
      tap((res) => this.handleApiResponse(res, 'Promotion updated successfully', 'Updation failed')),
      catchError((error) => this.handleError(error, 'Promotion update failed'))
    );
  }

  private handleApiResponse(res: any, successMessage: string, failureMessage: string): void {

    console.log("API Response:", res);
    if (res.status === true) {
      this._toastrService.showSuccess(res.msg || successMessage);
      this._router.navigate(['/promotion']);
    } else {
      this._toastrService.showError(res.msg || failureMessage);
    }
  }

  private handleError(error: any, fallbackMessage: string): Observable<any> {
    console.error('API Error:', error);
    this._toastrService.showError(error?.error?.message || fallbackMessage);
    return throwError(() => error);
  }

  onCancel() {
    this._router.navigate(['/promotion']);
  }
}

