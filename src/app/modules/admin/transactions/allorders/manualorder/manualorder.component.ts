import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../../../core/services/order.service';
import { ToastService } from '../../../../../core/services/toastr.service';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MATERIAL_IMPORTS } from '../../../../material.import';
import { QuillModule } from 'ngx-quill';   // ✅ Import here
import { ProductService } from '../../../../../core/services/product.service';


@Component({
  selector: 'app-manualorder',
  imports: [MATERIAL_IMPORTS, QuillModule],   
  templateUrl: './manualorder.component.html',
  styleUrl: './manualorder.component.scss'
})
export class ManualorderComponent {
  manualOrderForm!: FormGroup;
  editMode = false;   // ✅ track add/edit
  manualorderId: string;
  editId: string | null;
  usertoken: any;
  pageDetails: any;
  products: any[] = []; // 🧾 Store product list here
  methods: any[] = []; // 🧾 Store methods list here
  countries: any[] = []; // 🧾 Store country list here
  sizes: any[] = []; // 🧾 Store country list here
  colors: any[] = []; // 🧾 Store country list here
  
  constructor(private _router: Router,private fb: FormBuilder,private route: ActivatedRoute,private _masterservice: OrderService,private _toastrService: ToastService,private _productservice: ProductService) {}

  ngOnInit(): void {

    this.manualorderId = this.route.snapshot.paramMap.get('id') || '';
    console.log('page ID:', this.manualorderId);
    
    this.manualOrderForm = this.fb.group({     
      paymentMethod: ['', Validators.required],
      discount: [0],
      deliveryFee: [2.5],
      transactionId: [''],
      items: this.fb.array([this.createItem()]),
      shippingAddress: this.fb.group({
        label: ['', Validators.required],
        area: ['', Validators.required],
        street: ['', Validators.required],
        city: ['', Validators.required],
        state:['', Validators.required],
        postalCode: ['', Validators.required],
        country: ['', Validators.required],
      })
    });    

    this.loadProducts(); // 🔹 Load product list on init
  }

  get items() {
    return this.manualOrderForm.get('items') as FormArray;
  }

  loadProducts() {
    this._productservice.getAllProductList(this.usertoken).subscribe(res => this.products = res.data.products);
    this._productservice.getAllSizes(this.usertoken).subscribe(res => this.sizes = res.data.docs);
    this._productservice.getAllColors(this.usertoken).subscribe(res => this.colors = res.data.docs);
    this._masterservice.getAllCountry(this.usertoken).subscribe(res => this.countries = res.data.docs);
    this._masterservice.getAllPaymentMethod(this.usertoken).subscribe(res => this.methods = res.data.docs);
  }

  createItem(): FormGroup {
    return this.fb.group({
      productId: ['', Validators.required],
      color_id: ['', Validators.required],
      size_id: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  addItem() {
    this.items.push(this.createItem());
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  onSubmit() {
    
    if (this.manualOrderForm.invalid) {
      this.manualOrderForm.markAllAsTouched();
      return;
    }

    const payload = { ...this.manualOrderForm.value };

    if (this.editId) {
      this.updateData(payload, this.editId).subscribe();
    } else {
      this.saveData(payload).subscribe();
    }
  }

  public saveData(data: any): Observable<any> {

    

    const payload = {
      paymentMethod: data.paymentMethod,
      discount: data.discount,
      deliveryFee: data.deliveryFee,
      transactionId: data.transactionId,
      items: data.items, // or you can manually build like below
      shippingAddress: {
        label: data.shippingAddress.label,
        area: data.shippingAddress.area,
        address: data.shippingAddress.area,
        street: data.shippingAddress.street,
        apartment: data.shippingAddress.street,
        city: data.shippingAddress.city,
        state: data.shippingAddress.state,
        postalCode: data.shippingAddress.postalCode,
        country: data.shippingAddress.country
      },
      userId: localStorage.getItem("userId")
    };

    console.log(payload);
    
     return this._masterservice.createOrder(payload, this.usertoken).pipe(
       tap(res => this.handleApiResponse(res, 'Order created successfully', 'Order creation failed')),
       catchError(error => this.handleError(error, 'Order is not created. Please contact administrator'))
     );   
     
   }
   
   public updateData(data: any, editId: any): Observable<any> {    
   
    
    const payload = {
      paymentMethod: data.paymentMethod,
      discount: data.discount,
      deliveryFee: data.deliveryFee,
      transactionId: data.transactionId,
      items: data.items, // or you can manually build like below
      shippingAddress: {
        label: data.shippingAddress.label,
        area: data.shippingAddress.area,
        address: data.shippingAddress.area,
        street: data.shippingAddress.street,
        city: data.shippingAddress.city,
        state: data.shippingAddress.state,
        postalCode: data.shippingAddress.postalCode,
        country: data.shippingAddress.country
      },
      userId: localStorage.getItem("userId")
    };
    
     return this._masterservice.updateOrder(this.editId,payload,this.usertoken).pipe(
       tap(res => this.handleApiResponse(res, 'Order updated successfully', 'Order updation failed')),
       catchError(error => this.handleError(error, 'Order is not created. Please contact administrator'))
     );   
     
   }

    // APIs for save,update,delete and multi delte

  private handleApiResponse(res: any, successMessage: string, failureMessage: string): void {
    //console.log("API Response:", res);
  
    if (res.status === true) {
      // ✅ success
      this._toastrService.showSuccess(res.msg || successMessage);
      this._router.navigate(['/allorders']);
     
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
    return this.manualOrderForm.controls;
  }

  onContentChanged(event: any, controlName: string) {
    const content = event.editor.getText().trim(); // get plain text for validation
    this.manualOrderForm.get(controlName)?.setValue(content); // update form control
    this.manualOrderForm.get(controlName)?.markAsTouched(); // mark touched for validation
  }
  
  
  onCancel() {
    this.manualOrderForm.reset({ status: 'Active' });
    this._router.navigate(['/allorders']);
  }  
}

