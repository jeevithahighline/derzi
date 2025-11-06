import { Component,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../../../material.import';
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
  colorImageGroups: any[] = [];
  productForm: FormGroup;
  editId: string | null;
  editMode: string;
  colorFiles: any = {}; // holds selected files per color
  colorPreviewUrls: any = {}; // for showing previews
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
  previewUrls: { [key: string]: string } = {};
  
 
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
      merchant_id: ['', Validators.required],
      length_id: [[], Validators.required],
      fabric_id: [[], Validators.required],
      type_id: [[], Validators.required],
      brand_id: [[], Validators.required],
      size_id: [[], Validators.required],
      color_id: [[], Validators.required],
      care_id: [[], Validators.required],
      price: ['', Validators.required],
      vatPercentage: ['', Validators.required],
      status: [true, Validators.required],
      default_images: [null],
      default_ar_images: [null],
      color_images: this.fb.control([]),
    });
  
    // ✅ EDIT MODE LOGIC
    if (this.productId) {
      this.editId = this.productId;
  
      this._productservice.getSpecificProduct(this.productId, this.usertoken).subscribe({
        next: (res) => {
          this.productDetails = res.data.product;
          if (!this.productDetails) return;
  
          //console.log('🟢 Product details:', this.productDetails);

          console.log('🟢 Backend URl:', this.backendUrl);

          // ✅ Default image previews
          // ✅ Default English image
      

          if (this.productDetails.default_images?.length > 0) {
            const imgObj = this.productDetails.default_images[0];
            const imgPath = imgObj.image?.startsWith('http')
              ? imgObj.image
              : this.backendUrl + imgObj.image;
          
            this.previewUrls.default_images = imgPath;
            this.selectedFileNames.default_images = imgObj.image.split('/').pop();
          }
          
          if (this.productDetails.default_ar_images?.length > 0) {
            const imgObj = this.productDetails.default_ar_images[0];
            const imgPath = imgObj.image?.startsWith('http')
              ? imgObj.image
              : this.backendUrl + imgObj.image;
          
            this.previewUrls.default_ar_images = imgPath;
            this.selectedFileNames.default_ar_images = imgObj.image.split('/').pop();
          }
          
  
          this.colorPreviewUrls = {};
          const colorImagesArray: any[] = [];
  
          (this.productDetails.colors || []).forEach((color: any) => {
            const colorId = color.id || color._id;
  
            // --- Collect existing English images
            const productImgs = (this.productDetails.product_images || [])
              .filter((img: any) => img.color_id === colorId)
              .map((img: any) =>
                img.image?.startsWith('http')
                  ? img.image
                  : this.backendUrl + img.image
              );
  
            // --- Collect existing Arabic images
            const productArImgs = (this.productDetails.product_ar_images || [])
              .filter((img: any) => img.color_id === colorId)
              .map((img: any) =>
                img.image?.startsWith('http')
                  ? img.image
                  : this.backendUrl + img.image
              );
  
            // ✅ Set previews for UI display
            this.colorPreviewUrls[colorId] = {
              product_images: productImgs,
              product_ar_images: productArImgs,
            };
  
            // ✅ Maintain color structure in the form (files empty)
            colorImagesArray.push({
              color_id: colorId,
              product_images: [],
              product_ar_images: [],
            });
          });
  
          // ✅ Patch color_images array in the form
          this.productForm.patchValue({ color_images: colorImagesArray });
  
          console.log('🟢 colorPreviewUrls:', this.colorPreviewUrls);
          
  
          // ✅ Patch other non-image fields
          this.productForm.patchValue({
            name: this.productDetails.name || '',
            name_ar: this.productDetails.name_ar || '',
            description: this.productDetails.description || '',
            description_ar: this.productDetails.description_ar || '',
            price: +this.productDetails.price || 0,
            vatPercentage: +this.productDetails.vatPercentage || 0,
            quantity: +this.productDetails.quantity || 0,
            status: this.productDetails.status ?? true,
            merchant_id: this.productDetails.merchant?.[0]?.id || '',
            category: (this.productDetails.categories || []).map((c: any) => c._id || c.id),
            length_id: (this.productDetails.lengths || []).map((l: any) => l._id || l.id),
            fabric_id: (this.productDetails.fabrics || []).map((f: any) => f._id || f.id),
            type_id: (this.productDetails.types || []).map((t: any) => t._id || t.id),
            brand_id: (this.productDetails.brands || []).map((b: any) => b._id || b.id),
            size_id: (this.productDetails.sizes || []).map((s: any) => s._id || s.id),
            care_id: (this.productDetails.cares || []).map((c: any) => c._id || c.id),
            color_id: (this.productDetails.colors || []).map((clr: any) => clr._id || clr.id),
          });
        },
        error: (err) => console.error('Error fetching product details', err),
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



     // 🧩 Debug log — verify FormData contents
    for (const pair of (formData as any).entries()) {
      console.log(pair[0], pair[1]);
    }


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
  
    // 🧩 Basic fields
    const basicFields = [
      'name',
      'name_ar',
      'description',
      'description_ar',
      'price',
      'vatPercentage',
      'quantity',
      'status',
      'merchant_id',
    ];
  
    basicFields.forEach((field) => {
      formData.append(field, data[field]?.toString() || '');
    });
  
    formData.append('userId', localStorage.getItem('userId') || '');
  
    // 🧩 Multi-select fields
    const arrayFields = [
      'category',
      'length_id',
      'fabric_id',
      'type_id',
      'brand_id',
      'size_id',
      'color_id',
      'care_id',
    ];
  
    arrayFields.forEach((field) => {
      if (Array.isArray(data[field])) {
        data[field].forEach((val: string) => formData.append(field, val));
      }
    });
  
    // 🧩 Dynamic color-based image uploads
    if (Array.isArray(data.color_images)) {
      data.color_images.forEach((colorItem: any) => {
        const colorId = colorItem.color_id;
        if (!colorId) return;
  
        // Normal images
        if (Array.isArray(colorItem.product_images)) {
          colorItem.product_images.forEach((file: File) => {
            if (file instanceof File) {
              formData.append(`color_${colorId}_product_images`, file, file.name);
            }
          });
        }
  
        // Arabic images
        if (Array.isArray(colorItem.product_ar_images)) {
          colorItem.product_ar_images.forEach((file: File) => {
            if (file instanceof File) {
              formData.append(`color_${colorId}_product_ar_images`, file, file.name);
            }
          });
        }
      });
    }

    // 🧩 Default (main) images
    if (data.default_images instanceof File) {
      formData.append('default_images', data.default_images, data.default_images.name);
    }

    if (data.default_ar_images instanceof File) {
      formData.append('default_ar_images', data.default_ar_images, data.default_ar_images.name);
    }

  
    return formData;
  }
  
 

  onColorFileSelected(event: any, colorId: string, type: 'product_images' | 'product_ar_images') {
    const files = Array.from(event.target.files || []);
  
    // Initialize preview map for this color
    if (!this.colorPreviewUrls[colorId]) {
      this.colorPreviewUrls[colorId] = { product_images: [], product_ar_images: [] };
    }
  
    // Update preview URLs
    this.colorPreviewUrls[colorId][type] = files.map((f: any) => URL.createObjectURL(f));
  
    // Get existing form value
    const formValue = this.productForm.value;
  
    // Ensure color_images array exists
    if (!Array.isArray(formValue.color_images)) {
      formValue.color_images = [];
    }
  
    // Find existing color entry
    let colorEntry = formValue.color_images.find((c: any) => c.color_id === colorId);
  
    // If not found, add a new one
    if (!colorEntry) {
      colorEntry = { color_id: colorId, product_images: [], product_ar_images: [] };
      formValue.color_images.push(colorEntry);
    }
  
    // Update product_images or product_ar_images for that color
    colorEntry[type] = files;
  
    // Update the form control
    this.productForm.patchValue({ color_images: formValue.color_images });
  
    console.log('✅ Updated color_images:', this.productForm.value.color_images);
  }

  selectedFileNames1: { [key: string]: string } = {};

  onFileSelected(event: Event, controlName: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
  
      this.productForm.patchValue({ [controlName]: file });
      this.productForm.get(controlName)?.updateValueAndValidity();
  
      this.selectedFileNames1[controlName] = file.name;
  
      // ✅ Generate preview
      const reader = new FileReader();
      reader.onload = () => (this.previewUrls[controlName] = reader.result as string);
      reader.readAsDataURL(file);
    }
  }
   
  
  onCancel() {
    this.productForm.reset({ status: 'Active' });
    this._router.navigate(['/products']);
  }
  
}


