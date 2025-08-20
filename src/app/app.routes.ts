import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { DashboardComponent } from 'app/modules/admin/dashboard/dashboard.component';
import { AuthForgotPasswordComponent } from 'app/modules/auth/forgot-password/forgot-password.component';
import { AuthResetPasswordComponent } from 'app/modules/auth/reset-password/reset-password.component';
import { AuthSignInComponent } from 'app/modules/auth/sign-in/sign-in.component';
import { TypeComponent } from 'app/modules/admin/masters/type/type.component';
import { CountriesComponent } from 'app/modules/admin/masters/countries/countries.component';
import { BannersComponent } from 'app/modules/admin/masters/banners/banners.component';
import { BrandComponent } from 'app/modules/admin/masters/brand/brand.component';
import { LengthComponent } from 'app/modules/admin/masters/length/length.component';
import { FabricComponent} from 'app/modules/admin/masters/fabric/fabric.component';
import { SizeComponent } from 'app/modules/admin/masters/size/size.component';
import { ColorComponent } from 'app/modules/admin/masters/color/color.component';
import { CareComponent} from 'app/modules/admin/masters/care/care.component';


export const appRoutes: Route[] = [

    {path: '', pathMatch : 'full', redirectTo: 'dashboard'},
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'dashboard'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'forgot-password', component: AuthForgotPasswordComponent},
            {path: 'reset-password', component: AuthResetPasswordComponent},
            {path: 'sign-in', component: AuthSignInComponent},
        ]
    },      
    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'dashboard', component: DashboardComponent},
            {path: 'type', component: TypeComponent},
            {path: 'countries', component: CountriesComponent},
            {path: 'banners', component: BannersComponent},
            {path: 'brand', component: BrandComponent},
            {path: 'length', component: LengthComponent},
            {path: 'fabric', component: FabricComponent},
            {path: 'color', component: ColorComponent},
            {path: 'size', component: SizeComponent},
            {path: 'care', component: CareComponent},
        ]
    }
];
