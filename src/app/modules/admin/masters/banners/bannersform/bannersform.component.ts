import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BannerService } from '../../../../../core/services/banner.service';
import { ToastService } from '../../../../../core/services/toastr.service';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MATERIAL_IMPORTS } from '../../../../material.import';


@Component({
  selector: 'app-bannersform',
  standalone: true,
  imports: [MATERIAL_IMPORTS],
  templateUrl: './bannersform.component.html',
  styleUrl: './bannersform.component.scss'
})
export class BannersformComponent implements OnInit {
  dynamicForm: FormGroup;
  selectedFileName = '';
  selectedBannerType: string = '';
  entityOptions: { id: string; name: string }[] = [];
  editMode = false;
  bannerId: string;
  editId: string | null;
  usertoken: any;
  bannerDetails: any;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private _router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _masterservice: BannerService,
    private _toastrService: ToastService
  ) {}

  ngOnInit(): void {
    this.bannerId = this.route.snapshot.paramMap.get('id') || '';
    console.log('Banner ID:', this.bannerId);

    this.dynamicForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      title_ar: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(250)]],
      description_ar: ['', [Validators.required, Validators.maxLength(250)]],
      image: [null, Validators.required],
      status: [true, Validators.required],
      bannerType: ['', Validators.required],
      entityId: ['', Validators.required]
    });

    if (this.bannerId) {
      this.editMode = true;
      this.editId = this.bannerId;

      this._masterservice.getSpecificBanner(this.bannerId, this.usertoken).subscribe({
        next: (res) => {
          this.bannerDetails = res.data;
          console.log('Banner details:', this.bannerDetails);

          if (this.bannerDetails) {
            this.dynamicForm.patchValue({
              title: this.bannerDetails.title || '',
              title_ar: this.bannerDetails.title_ar || '',
              description: this.bannerDetails.description || '',
              description_ar: this.bannerDetails.description_ar || '',
              status: this.bannerDetails.status,
              bannerType: this.bannerDetails.bannertype
            });

            // Load dropdown options and patch entityId after options load
            this.onBannerTypeChange(this.bannerDetails.bannertype, this.bannerDetails.referenceId);

            // Image preview for edit mode
            if (this.bannerDetails.images && this.bannerDetails.images.length > 0) {
              const fullImagePath = this.bannerDetails.images[0];
              this.selectedFileName = fullImagePath.split('/').pop() || '';
              this.previewUrl = fullImagePath;

              // PATCH placeholder to make required validator pass
              this.dynamicForm.patchValue({ image: 'existing' });
              this.dynamicForm.get('image')?.updateValueAndValidity();
            }
          }
        },
        error: (err) => console.error('Error fetching banner details', err)
      });
    }
  }

  onBannerTypeChange(type: string, selectedEntityId?: string) {
    this.selectedBannerType = type;
    this.entityOptions = [];
    this.dynamicForm.patchValue({ entityId: '' });

    const patchEntity = (id: string) => {
      this.dynamicForm.patchValue({ entityId: id });
    };

    const handleResponse = (list: any[], idField: string, nameField: string) => {
      this.entityOptions = list.map(item => ({
        id: item[idField],
        name: item[nameField]
      }));
      if (selectedEntityId) patchEntity(selectedEntityId);
    };

    switch (type) {
      case 'page':
        this._masterservice.getPageList(this.usertoken).subscribe(res => {
          handleResponse(res.data?.docs || [], '_id', 'title');
        });
        break;
      case 'merchant':
        this._masterservice.getMerchantList(this.usertoken).subscribe(res => {
          handleResponse(res.data?.docs || [], '_id', 'title');
        });
        break;
      case 'category':
        this._masterservice.getCategoryList(this.usertoken).subscribe(res => {
          handleResponse(res.data?.docs || [], '_id', 'name');
        });
        break;
      case 'product':
        this._masterservice.getProductList(this.usertoken).subscribe(res => {
          handleResponse(res.data?.products || [], '_id', 'name');
        });
        break;
    }
  }

  get f() {
    return this.dynamicForm.controls;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFileName = file.name;

      // Patch file into form control
      this.dynamicForm.patchValue({ image: file });
      this.dynamicForm.get('image')?.updateValueAndValidity();

      // Generate preview
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result);
      reader.readAsDataURL(file);
    }
  }

  saveBanner() {
    if (this.dynamicForm.invalid) {
      this.dynamicForm.markAllAsTouched();
      return;
    }

    const payload = { ...this.dynamicForm.value };

    if (this.editId) {
      this.updateData(payload, this.editId).subscribe();
    } else {
      this.saveData(payload).subscribe();
    }
  }

  saveData(data: any): Observable<any> {
    const formData = new FormData();
    formData.append('title', data.title || '');
    formData.append('title_ar', data.title_ar || '');
    formData.append('description', data.description || '');
    formData.append('description_ar', data.description_ar || '');
    formData.append('bannertype', data.bannerType || '');
    formData.append('referenceId', data.entityId || '');
    formData.append('status', data.status ? 'true' : 'false');
    formData.append('userId', localStorage.getItem('userId') || '');

    const fileControl = this.dynamicForm.get('image')?.value;
    if (fileControl instanceof File) {
      formData.append('images', fileControl, fileControl.name);
    }

    return this._masterservice.createBanner(formData, this.usertoken).pipe(
      tap(res => {
        this._toastrService.showSuccess('Banner created successfully');
        this._router.navigate(['/banners']);
      }),
      catchError(err => {
        const message = err?.error?.message || err?.message;
        this._toastrService.showError(message || 'Banner creation failed');
        return throwError(() => err);
      })
    );
  }

  updateData(data: any, editId: any): Observable<any> {
    const formData = new FormData();
    formData.append('title', data.title || '');
    formData.append('title_ar', data.title_ar || '');
    formData.append('description', data.description || '');
    formData.append('description_ar', data.description_ar || '');
    formData.append('bannertype', data.bannerType || '');
    formData.append('referenceId', data.entityId || '');
    formData.append('status', data.status ? 'true' : 'false');
    formData.append('userId', localStorage.getItem('userId') || '');

    const fileControl = this.dynamicForm.get('image')?.value;
    if (fileControl instanceof File) {
      formData.append('images', fileControl, fileControl.name);
    }

    return this._masterservice.updateBanner(editId, formData, this.usertoken).pipe(
      tap(res => {
        this._toastrService.showSuccess('Banner updated successfully');
        this._router.navigate(['/banners']);
      }),
      catchError(err => {
        this._toastrService.showError('Banner update failed');
        return throwError(() => err);
      })
    );
  }

  onCancel() {
    this.dynamicForm.reset({ status: true });
    this._router.navigate(['/banners']);
  }
}

