import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    imports: [
        RouterLink,
        FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
    ],
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email: [
                'derziapp@gmail.com',
                [Validators.required, Validators.email],
            ],
            password: ['admin', Validators.required],
            rememberMe: [''],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
     signIn(): void {
        if (this.signInForm.invalid) {
          return;
        }
      
        this.signInForm.disable();
        this.showAlert = false;
      
        const requestBody = {
          email: this.signInForm.value.email,
          password: this.signInForm.value.password,
        };
      
        this._authService.postLoginInfo(requestBody).subscribe(
          (response: any) => {
            //console.log("loginresponse",response.data.token);
            const bearerToken = '969F1505-A0F3-4D21-9C8E-671FD45B5D54';
            // ✅ Save token using AuthService setter
            if (response?.data?.token) {
              //alert("here");
              //console.log("match here")
              //console.log(response.data);
              localStorage.setItem('bearertoken', bearerToken);
              localStorage.setItem('usertoken', response.data.token);
              localStorage.setItem('userId', response.data._id);
              localStorage.setItem('useremail', response.data.email);
              localStorage.setItem('firstname', response.data.firstname);
            }
      
            // ✅ Redirect to original URL or dashboard
            let redirectURL =
            this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/dashboard';

            //console.log(redirectURL);           
            this._router.navigateByUrl(redirectURL); 
          },
          (error) => {
            this.signInForm.enable();
            this.signInNgForm.resetForm();
      
            this.alert = {
              type: 'error',
              message: 'Wrong email or password',
            };
            this.showAlert = true;
          }
        );
      }
      
    
}
