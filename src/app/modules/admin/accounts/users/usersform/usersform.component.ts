import { Component,Inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../../material.import';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-usersform',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './usersform.component.html',
  styleUrl: './usersform.component.scss'
})
export class UsersformComponent {
  userform: FormGroup;

  editMode = false;   // ✅ track add/edit
  userId: number | null = null;

  users = [
    {
      "id":1,
      "firstname": "Ahmed",
      "lastname": "Khan",
      "email": "ahmed@example.com",
      "mobilenumber": "9876543210",
      "username": "johndriver",
      "password": "StrongPass123",
      "location": "New York",
      "status": "Active",
      isSelected: false
    }, 
    {
      id:2,
      "firstname": "Salman",
      "lastname": "Doe",
      "email": "salman@example.com",
      "mobilenumber": "9876543210",
      "username": "samdriver",
      "password": "StrongPass123",
      "location": "New York",
      "status": "Active",
      isSelected: false
    }
  ];
  constructor(private _router: Router,private fb: FormBuilder,private route: ActivatedRoute) {}
  

  ngOnInit(): void {

    this.userform = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.minLength(3)]],   
      username: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]], 
      mobilenumber: ['', [Validators.required]], 
      status: ['Active', Validators.required], 

    });

    // ✅ get id from route
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.editMode = true;
        this.userId = +id;
        this.loadUserData(this.userId);
      }
    });

  } 
  
  loadUserData(id: number){
    const page = this.users.find(b => b.id === id);
    if (page) {
      this.userform.patchValue(page);
    }
  }
  

  onSubmit() {
    if (this.userform.valid) {
      console.log('✅ Form Data:', this.userform.value);
      this._router.navigate(['/users']);
    } else {
      this.userform.markAllAsTouched();
    }
  }

  // helper for template
  get f() {
    return this.userform.controls;
  }

  

  onCancel() {
    this.userform.reset({ status: 'Active' });
    this._router.navigate(['/users']);
  }  
}


