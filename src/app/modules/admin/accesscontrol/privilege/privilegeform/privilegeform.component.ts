import { Component,Inject,OnInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../../material.import';
import { FormBuilder, FormControl,FormGroup, Validators,FormArray } from '@angular/forms';
import { Router,ActivatedRoute  } from '@angular/router';
import { RoleService } from '../../../../../core/services/role.service';
import { PrivilegeService } from '../../../../../core/services/privilege.service';
import { tap, catchError,takeWhile } from 'rxjs/operators';
import { ToastService } from '../../../../../core/services/toastr.service';
import { of, throwError ,Observable,lastValueFrom  } from 'rxjs';

@Component({
  selector: 'app-privilegeform',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './privilegeform.component.html',
  styleUrls: ['./privilegeform.component.scss']
})
export class PrivilegeformComponent implements OnInit {

  privilegeform!: FormGroup;
  usertoken: any;
  roles: any[] = [];
  merchants: any[] = [];
  menus: any = {}; // keep as grouped object
  editId: any;
  privilegeId: any;
  privilegeDetails: any;

  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private _roleservice: RoleService,
    private _privilegeservice: PrivilegeService,
    private _toastrService: ToastService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.privilegeId = this.route.snapshot.paramMap.get('id') || '';
    this.usertoken = localStorage.getItem('usertoken');

    this.privilegeform = this.fb.group({
      privilegename: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(250)]],
      roleId: [[], Validators.required],
      derziuserId: [[], Validators.required],
      permissions: this.fb.group({}),
      status: ['active', Validators.required]
    });

    this.loadDropdownData(); // builds menus + controls and then fetches privilege (if id exists)
  }

  /**
   * Normalize menu names to a canonical control key:
   * - trim whitespace
   * - convert to lowercase
   * - replace spaces with underscores
   * Example: "User Management" -> "user_management"
   */
  normalizeMenu(name: string): string {
    if (!name && name !== '') return '';
    return name.toString().trim().replace(/\s+/g, '_').toLowerCase();
  }

  loadDropdownData(): void {
    // load merchants and roles in parallel (no change)
    this._roleservice.getAllDerziUser(this.usertoken).subscribe(res => this.merchants = res.data);
    this._roleservice.getAllDerziRoles(this.usertoken).subscribe(res => this.roles = res.data.docs);

    // load menus -> build grouped structure -> create permission controls -> then fetch privilege details
    this._roleservice.getAllMenus(this.usertoken).subscribe(res => {
      const allMenus = res.data.docs || [];

      // Group menus into parent-child structure
      const grouped = allMenus.reduce((acc: any, menu: any) => {
        const parent = menu.parentMenu || 'root';
        if (!acc[parent]) acc[parent] = [];
        acc[parent].push(menu);
        return acc;
      }, {});

      this.menus = grouped;

      // Build dynamic form controls for permissions using normalized names
      const permissionsGroup = this.privilegeform.get('permissions') as FormGroup;
      allMenus.forEach((menu: any) => {
        const originalName = menu.menuname;
        const key = this.normalizeMenu(originalName);
        ['add', 'edit', 'delete', 'view'].forEach(action => {
          const controlName = `${key}_${action}`;
          if (!permissionsGroup.contains(controlName)) {
            permissionsGroup.addControl(controlName, this.fb.control(false));
          }
        });
      });

      // Debug: list controls created
      console.log('Permission controls created:', Object.keys((this.privilegeform.get('permissions') as FormGroup).controls));

      // AFTER controls exist, fetch privilege details (if editing)
      if (this.privilegeId) {
        this.fetchPrivilegeDetails();
      }
    }, err => {
      console.error('Error loading menus', err);
    });
  }

  fetchPrivilegeDetails() {
    // fetch privilege object
    this._privilegeservice.getSpecificPrivilege(this.privilegeId, this.usertoken).subscribe({
      next: (res) => {
        this.privilegeDetails = res.data;
        console.log('Privilege details loaded:', this.privilegeDetails);

        if (this.privilegeDetails) {
          this.privilegeform.patchValue({
            privilegename: this.privilegeDetails.privilegename || '',
            description: this.privilegeDetails.description || '',
            // roleId can be array/object from API; store id or first id depending on API
            roleId: Array.isArray(this.privilegeDetails.roleId) ? this.privilegeDetails.roleId[0] : this.privilegeDetails.roleId,
            derziuserId: this.privilegeDetails.derziuserId || [],
            status: this.privilegeDetails.status || 'active'
          });

          // Now patch permissions using normalized keys
          const permissionsGroup = this.privilegeform.get('permissions') as FormGroup;

          // debug: show privileges array
          console.log('Privileges to patch:', this.privilegeDetails.privileges);

          (this.privilegeDetails.privileges || []).forEach((item: any) => {
            const menuRaw = item.menu || '';
            const menuKey = this.normalizeMenu(menuRaw); // normalize here
            const perms = item.permissions || {};

            const mapping: { [k: string]: boolean } = {
              add: Boolean(perms.create),
              edit: Boolean(perms.edit),
              delete: Boolean(perms.delete),
              view: Boolean(perms.view)
            };

            Object.entries(mapping).forEach(([action, val]) => {
              const controlName = `${menuKey}_${action}`;
              const fullPath = `permissions.${controlName}`;
              const control = permissionsGroup.get(controlName);
              if (control) {
                control.setValue(val);
              } else {
                // debug: warn if control doesn't exist (helps identify name mismatches)
                console.warn(`Missing permission control for menu "${menuRaw}" -> expected control "${controlName}".`);
              }
            });
          });
        }
      },
      error: (err) => {
        console.error('Error fetching privilege details', err);
      }
    });
  }

  /** Toggle an entire permission column (Add/Edit/Delete/View) */
  toggleColumn(action: string, event: any) {
    const checked = event.checked;
    const permissionsGroup = this.privilegeform.get('permissions') as FormGroup;

    // Collect all menu objects from grouped menus
    const allMenus = [
      ...(this.menus['root'] || []),
      ...Object.values(this.menus).flat().filter((m: any) => m && m.menuname)
    ];

    allMenus.forEach((menu: any) => {
      const key = this.normalizeMenu(menu.menuname);
      const controlName = `${key}_${action}`;
      if (!permissionsGroup.contains(controlName)) {
        permissionsGroup.addControl(controlName, this.fb.control(false));
      }
      permissionsGroup.get(controlName)?.setValue(checked);
    });
  }

  /** Handle permission checkbox */
  onPermissionChange(module: string, action: string, event: any) {
    const permissionsGroup = this.privilegeform.get('permissions') as FormGroup;
    const controlName = `${this.normalizeMenu(module)}_${action}`;
    const control = permissionsGroup.get(controlName);
    if (control) {
      control.setValue(event.checked);
    } else {
      console.warn(`onPermissionChange: control not found for ${controlName}`);
      // create it defensively so UI doesn't desync
      permissionsGroup.addControl(controlName, this.fb.control(event.checked));
    }
  }

  // helper
  get f() {
    return this.privilegeform.controls;
  }

  onSave() {
    if (this.privilegeform.invalid) {
      this.privilegeform.markAllAsTouched();
      return;
    }

    const formValue = this.privilegeform.value;

    // normalize permission keys (already normalized control names)
    const normalizedPermissions: any = {};
    Object.keys(formValue.permissions).forEach(key => {
      // keys are already normalized at creation time, but keep safe normalization
      const newKey = key.toString().trim().replace(/\s+/g, '_').toLowerCase();
      normalizedPermissions[newKey] = formValue.permissions[key];
    });

    // Group by menu name (before "_add", "_edit", "_delete", "_view")
    const grouped: any = {};
    Object.keys(normalizedPermissions).forEach(key => {
      const parts = key.split('_');
      // join all except last part as menu name (handles menus with underscores)
      const action = parts[parts.length - 1];
      const menuNameParts = parts.slice(0, parts.length - 1);
      const menuName = menuNameParts.join('_');

      if (!grouped[menuName]) {
        grouped[menuName] = { view: false, create: false, edit: false, delete: false };
      }

      switch (action) {
        case 'view':
          grouped[menuName].view = normalizedPermissions[key];
          break;
        case 'add':
        case 'create':
          grouped[menuName].create = normalizedPermissions[key];
          break;
        case 'edit':
          grouped[menuName].edit = normalizedPermissions[key];
          break;
        case 'delete':
          grouped[menuName].delete = normalizedPermissions[key];
          break;
      }
    });

    // Convert grouped menus into array
    const privileges = Object.entries(grouped).map(([menu, permissions]) => ({
      // when sending to backend, use the original menu key format backend expects.
      // If backend expects lowercased underscored names, menu is already normalized.
      menu,
      permissions
    }));

    const payload = {
      privilegename: formValue.privilegename,
      description: formValue.description,
      roleId: formValue.roleId,
      derziuserId: formValue.derziuserId,
      privileges: privileges
    };

    console.log('✅ Final Schema-Matched Payload:', payload);

    if (this.privilegeId) {
      this.updateData(payload, this.privilegeId).subscribe();
    } else {
      this.saveData(payload).subscribe();
    }
  }

  public saveData(data: any): Observable<any> {
    return this._privilegeservice.createPrivilege(data, this.usertoken).pipe(
      tap(res => this.handleApiResponse(res, 'Privilege created successfully', 'Privilege creation failed')),
      catchError(error => this.handleError(error, 'Privilege is not created. Please contact administrator'))
    );
  }

  public updateData(data: any, privilegeId: any): Observable<any> {
    return this._privilegeservice.updatePrivilege(this.privilegeId, data, this.usertoken).pipe(
      tap(res => this.handleApiResponse(res, 'Privilege updated successfully', 'Privilege updation failed')),
      catchError(error => this.handleError(error, 'Privilege is not created. Please contact administrator'))
    );
  }

  private handleApiResponse(res: any, successMessage: string, failureMessage: string): void {
    if (res.status === true) {
      this._toastrService.showSuccess(res.msg || successMessage);
      this._router.navigate(['/privileges']);
    } else {
      this._toastrService.showError(res.msg || failureMessage);
    }
  }

  private handleError(error: any, fallbackMessage: string): Observable<any> {
    console.error('API Error:', error);

    const message =
      error?.error?.message ||
      error?.message ||
      fallbackMessage;

    this._toastrService.showError(message);

    return throwError(() => error);
  }

  onCancel() {
    this.privilegeform.reset();
    this._router.navigate(['/privileges']);
  }
}

