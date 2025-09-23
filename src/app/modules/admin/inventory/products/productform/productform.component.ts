import { Component,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../../../material.import';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from '../../../../../core/services/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../../../core/services/toastr.service';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-productform',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './productform.component.html',
  styleUrl: './productform.component.scss'
})
export class ProductformComponent {
  productForm: FormGroup;
  editId: string | null;
  editMode: string;
 
  backendUrl = environment.backendurlImages;
  usertoken: any;
  merchants: any[] = [];
  categories: any[] = [];
  lengths: any[] = [];
  fabrics: any[] = [];
  types: any[] = [];
  brands: any[] = [];
  sizes: any[] = [];
  colors: any[] = [];
  cares: any[] = [];
  currencies: any[] = [];
  productDetails: any;
  productId: any;
    // ✅ Add this line

  // Track multiple file names for each control
  selectedFileNames: { [key: string]: string[] } = {};

  // Track multiple previews for each control
  previewUrls: { [key: string]: string[] } = {};
  
 
  constructor(
    private _router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _productservice: ProductService,
    private _toastrService: ToastService
  ) {}

  ngOnInit(): void {
    this.usertoken = localStorage.getItem('usertoken');
    this.loadDropdownData();

    this.productId = this.route.snapshot.paramMap.get('id') || '';

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      name_ar: ['', Validators.required],
      description: ['', Validators.required],
      description_ar: ['', Validators.required],
      category: ['', Validators.required],
      quantity: ['', Validators.required],
      merchant_id: [[]],
      length_id: [[]],
      fabric_id: [[]],
      type_id: [[]],
      brand_id: [[]],
      size_id: [[]],
      color_id: [[]],
      care_id: [[]],
      priceWithVAT: ['', Validators.required],
      price: ['', Validators.required],
      currency: ['', Validators.required],
      vatPercentage: ['', Validators.required],
      status: [null, Validators.required],
      product_images: [[]],         // 👈 must start as empty array
      product_ar_images: [[]],      // 👈 must start as empty array
    });

    if (this.productId) {
      this.editId = this.productId;
      this._productservice.getSpecificProduct(this.productId, this.usertoken).subscribe({
        next: (res) => {
          this.productDetails = res.data;

          console.log(this.productDetails);

          if (this.productDetails) {

            // Preview URLs          

            this.previewUrls['product_images'] = (this.productDetails.product_images || []).map(
              (img: string) => this.backendUrl + img
            );
            
            this.previewUrls['product_ar_images'] = (this.productDetails.product_ar_images || []).map(
              (img: string) => this.backendUrl + img
            );
            

            console.log(this.previewUrls['product_images']);

            // For display purposes
            this.selectedFileNames['product_images'] = this.productDetails.product_images?.map((p: string) => p.split('/').pop()) || [];
            this.selectedFileNames['product_ar_images'] = this.productDetails.product_ar_images?.map((p: string) => p.split('/').pop()) || [];

            this.productForm.patchValue({
              name: this.productDetails.name || '',
              name_ar: this.productDetails.name_ar || '',
              description: this.productDetails.description || '',
              description_ar: this.productDetails.description_ar || '',
              price: +this.productDetails.price || 0,
              priceWithVAT: +this.productDetails.priceWithVAT || 0,
              vatPercentage: +this.productDetails.vatPercentage || 0,
              quantity: +this.productDetails.quantity || 0,
              currency: this.productDetails.currency || '',
              status: this.productDetails.status ?? true,
              category: this.productDetails.categories?.map((c: any) => c.id) || [],
              merchant_id: this.productDetails.merchant?.map((m: any) => m.id) || [],
              length_id: this.productDetails.lengths?.map((l: any) => l.id) || [],
              fabric_id: this.productDetails.fabrics?.map((f: any) => f.id) || [],
              type_id: this.productDetails.types?.map((t: any) => t.id) || [],
              brand_id: this.productDetails.brands?.map((b: any) => b.id) || [],
              size_id: this.productDetails.sizes?.map((s: any) => s.id) || [],
              color_id: this.productDetails.colors?.map((c: any) => c.id) || [],
              care_id: this.productDetails.cares?.map((c: any) => c.id) || [],
              product_images: [],        // will be filled when user selects new files
              product_ar_images: []
            });
            
          }
        },
        error: (err) => console.error('Error fetching product details', err)
      });
    }
  }

  loadDropdownData(): void {
    this._productservice.getAllMerchants(this.usertoken).subscribe(res => this.merchants = res.data.docs);
    this._productservice.getAllCategories(this.usertoken).subscribe(res => this.categories = res.data.docs);
    this._productservice.getAllLength(this.usertoken).subscribe(res => this.lengths = res.data.docs);
    this._productservice.getAllFabrics(this.usertoken).subscribe(res => this.fabrics = res.data.docs);
    this._productservice.getAllTypes(this.usertoken).subscribe(res => this.types = res.data.docs);
    this._productservice.getAllBrands(this.usertoken).subscribe(res => this.brands = res.data.docs);
    this._productservice.getAllSizes(this.usertoken).subscribe(res => this.sizes = res.data.docs);
    this._productservice.getAllColors(this.usertoken).subscribe(res => this.colors = res.data.docs);
    this._productservice.getAllCares(this.usertoken).subscribe(res => this.cares = res.data.docs);
    this._productservice.getAllCurrency(this.usertoken).subscribe(res => this.currencies = res.data.docs);
  }

  get f() {
    return this.productForm.controls;
  }

  save() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    const payload = { ...this.productForm.value };

    if (this.editId) {
      this.updateData(payload, this.editId).subscribe();
    } else {
      this.saveData(payload).subscribe();
    }
  }

  saveData(data: any): Observable<any> {
    const formData = this.prepareFormData(data);
    return this._productservice.createProduct(formData, this.usertoken).pipe(
      tap(res => {
        this._toastrService.showSuccess('Product created successfully');
        this._router.navigate(['/products']);
      }),
      catchError(err => {
        const message = err?.error?.message || err?.message;
        this._toastrService.showError(message || 'Product creation failed');
        return throwError(() => err);
      })
    );
  }

  updateData(data: any, editId: any): Observable<any> {
    const formData = this.prepareFormData(data);
    return this._productservice.updateProduct(editId, formData, this.usertoken).pipe(
      tap(res => {
        this._toastrService.showSuccess('Product updated successfully');
        this._router.navigate(['/products']);
      }),
      catchError(err => {
        this._toastrService.showError('Product update failed');
        return throwError(() => err);
      })
    );
  }

  private prepareFormData(data: any): FormData {
    const formData = new FormData();
    formData.append('name', data.name || '');
    formData.append('name_ar', data.name_ar || '');
    formData.append('description', data.description || '');
    formData.append('description_ar', data.description_ar || '');
    formData.append('price', data.price?.toString() || '0');
    formData.append('priceWithVAT', data.priceWithVAT?.toString() || '0');
    formData.append('vatPercentage', data.vatPercentage?.toString() || '0');
    formData.append('quantity', data.quantity || '');
    formData.append('currency', data.currency || '');
    formData.append('status', data.status ? 'true' : 'false');
    formData.append('userId', localStorage.getItem('userId') || '');

    // append array fields
    const arrayFields = ['category', 'merchant_id', 'length_id', 'fabric_id', 'type_id', 'brand_id', 'size_id', 'color_id', 'care_id'];
    arrayFields.forEach(field => {
      if (data[field] && Array.isArray(data[field])) {
        data[field].forEach((id: string) => formData.append(field, id));
      }
    });

    // append multiple files
    ['product_images', 'product_ar_images'].forEach(field => {
      const files: File[] = data[field] || [];
      if (Array.isArray(files)) {
        files.forEach(file => {
          if (file instanceof File) {
            formData.append(field, file, file.name);
          }
        });
      }
    });

    return formData;
  }

  onCancel() {
    this.productForm.reset({ status: 'Active' });
    this._router.navigate(['/products']);
  }

  onFileSelected(event: Event, controlName: string) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
  
    const files = Array.from(input.files); // always an array
  
    // patch the form with an array of files
    this.productForm.patchValue({ [controlName]: files });
    this.productForm.get(controlName)?.updateValueAndValidity();
  
    // save filenames for display
    this.selectedFileNames[controlName] = files.map(f => f.name);
  
    // generate previews
    this.previewUrls[controlName] = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => this.previewUrls[controlName].push(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
  
}


