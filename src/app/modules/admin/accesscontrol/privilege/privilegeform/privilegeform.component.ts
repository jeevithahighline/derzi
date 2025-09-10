import { Component,Inject,OnInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../../material.import';
import { FormBuilder, FormGroup, Validators,FormArray } from '@angular/forms';
import { Router,ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-privilegeform',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './privilegeform.component.html',
  styleUrls: ['./privilegeform.component.scss']
})
export class PrivilegeformComponent implements OnInit {

  privilegeform!: FormGroup;

  // Example dropdown data
  roles: string[] = ['Admin', 'Manager', 'Staff', 'Viewer'];
  groups: string[] = ['Group A', 'Group B', 'Group C'];
  merchants: string[] = ['Derzi User1', 'Derzi User2', 'Derzi User3'];

  // ✅ Permissions grouped into modules (so HTML *ngFor works)
  modules = [
    { name: 'Dashboard', actions: ['View', 'Edit'] },
    { name: 'Masters', actions: ['Add', 'Edit', 'Delete'] },
    { name: 'Services', actions: ['View', 'Update'] },
    { name: 'Pages', actions: ['View', 'Update'] },
    { name: 'Transactions', actions: ['View', 'Update'] },
    { name: 'Reports', actions: ['Export', 'Download'] },
    { name: 'Configuration', actions: ['View', 'Update'] },
    { name: 'Settings', actions: ['View', 'Update'] },
  ];

  constructor(private fb: FormBuilder, private _router: Router) {}

  ngOnInit(): void {
    this.privilegeform = this.fb.group({
      privilegename: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(250)]],
      
      // Multi-select dropdowns with required validation
      rolename: [[], Validators.required],
      groupname: [[], Validators.required],
      merchantname: [[], Validators.required],
      permissions: this.fb.group({})  // placeholder, we'll manage dynamically
    });

    // Build permission controls dynamically
    this.buildPermissions();
  }

  /** ✅ Create form controls for each permission */
  buildPermissions() {
    const permissionsGroup: any = {};
    this.modules.forEach(module => {
      module.actions.forEach(action => {
        permissionsGroup[`${module.name}_${action}`] = [false];
      });
    });
    this.privilegeform.setControl('permissions', this.fb.group(permissionsGroup));
  }

  /** ✅ Helper for template */
  get f() {
    return this.privilegeform.controls;
  }

  /** ✅ Check if "all" selected for dropdowns */
  allSelected(controlName: string): boolean {
    const selected = this.privilegeform.get(controlName)?.value || [];
    if (!Array.isArray(selected)) return false;
  
    let allOptions: string[] = [];
  
    if (controlName === 'rolename') {
      allOptions = this.roles;
    } else if (controlName === 'groupname') {
      allOptions = this.groups;
    } else if (controlName === 'merchantname') {
      allOptions = this.merchants;
    }
  
    return selected.length === allOptions.length;
  }
  

  /** ✅ Toggle "Select All" */
  toggleAllSelection(controlName: string) {
    const options =
      controlName === 'rolename' ? this.roles :
      controlName === 'groupname' ? this.groups :
      this.merchants;

    if (this.allSelected(controlName)) {
      this.privilegeform.get(controlName)?.setValue([]);
    } else {
      this.privilegeform.get(controlName)?.setValue([...options]);
    }
  }

  /** ✅ Handle permission checkbox */
  onPermissionChange(module: string, action: string, event: any) {
    const control = (this.privilegeform.get('permissions') as FormGroup)
      .get(`${module}_${action}`);
    if (control) {
      control.setValue(event.checked);
    }
  }

  onSubmit() {
    if (this.privilegeform.valid) {
      const formValue = this.privilegeform.value;

      // Extract selected permissions
      const selectedPermissions = Object.keys(formValue.permissions)
        .filter(key => formValue.permissions[key]);

      const payload = {
        privilegename: formValue.privilegename,
        description: formValue.description,
        rolename: formValue.rolename,
        groupname: formValue.groupname,
        merchantname: formValue.merchantname,
        permissions: selectedPermissions
      };

      console.log('Form Submitted: ', payload);
    } else {
      console.log('Form Invalid');
    }
  }

  onSave() {
    if (this.privilegeform.invalid) {
      this.privilegeform.markAllAsTouched();  // ✅ show validation errors
      return;
    }
    console.log(this.privilegeform.value); // ✅ form values when valid
  }

  onCancel() {
    this.privilegeform.reset();
    this._router.navigate(['/privileges']);
  }
}
