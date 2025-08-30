import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { DashboardComponent } from 'app/modules/admin/dashboard/dashboard.component';
import { AuthForgotPasswordComponent } from 'app/modules/auth/forgot-password/forgot-password.component';
import { AuthResetPasswordComponent } from 'app/modules/auth/reset-password/reset-password.component';
import { AuthSignInComponent } from 'app/modules/auth/sign-in/sign-in.component';

//Masters
import { TypeComponent } from 'app/modules/admin/masters/type/type.component';
import { CountriesComponent } from 'app/modules/admin/masters/countries/countries.component';
import { BannersComponent } from 'app/modules/admin/masters/banners/banners.component';
import { BrandComponent } from 'app/modules/admin/masters/brand/brand.component';
import { LengthComponent } from 'app/modules/admin/masters/length/length.component';
import { FabricComponent} from 'app/modules/admin/masters/fabric/fabric.component';
import { SizeComponent } from 'app/modules/admin/masters/size/size.component';
import { ColorComponent } from 'app/modules/admin/masters/color/color.component';
import { CareComponent} from 'app/modules/admin/masters/care/care.component';

//Inventory
import { CategoriesComponent } from 'app/modules/admin/inventory/categories/categories.component';
import { ProductsComponent } from 'app/modules/admin/inventory/products/products.component';
import { PromocodeComponent} from 'app/modules/admin/inventory/promocode/promocode.component';
import { PromocodeformComponent} from 'app/modules/admin/inventory/promocode/promocodeform/promocodeform.component';

//Access Control
import { GroupsComponent } from 'app/modules/admin/accesscontrol/groups/groups.component';
import { PrivilegeComponent } from 'app/modules/admin/accesscontrol/privilege/privilege.component';
import { RolesComponent} from 'app/modules/admin/accesscontrol/roles/roles.component';

//Accounts
import { DriversComponent } from 'app/modules/admin/accounts/drivers/drivers.component';
import { MerchantsComponent } from 'app/modules/admin/accounts/merchants/merchants.component';
import { UsersComponent} from 'app/modules/admin/accounts/users/users.component';

//Configuration
import { CurrencyComponent } from 'app/modules/admin/configuration/currency/currency.component';
import { EmailtemplatesComponent } from 'app/modules/admin/configuration/emailtemplates/emailtemplates.component';
import { PaymentmethodsComponent } from 'app/modules/admin/configuration/paymentmethods/paymentmethods.component';
import { SmstemplatesComponent} from 'app/modules/admin/configuration/smstemplates/smstemplates.component';

import { PagesComponent} from 'app/modules/admin/pages/pages.component';
import { FaqComponent} from 'app/modules/admin/faq/faq.component';
import { ServicesComponent} from 'app/modules/admin/services/services.component';
import { ServicesformComponent} from 'app/modules/admin/services/servicesform/servicesform.component';

//Reports
import { DriverreportComponent} from 'app/modules/admin/reports/driverreport/driverreport.component';
import { MerchantreportComponent} from 'app/modules/admin/reports/merchantreport/merchantreport.component';
import { OrdersreportComponent} from 'app/modules/admin/reports/ordersreport/ordersreport.component';
import { ProductreportComponent} from 'app/modules/admin/reports/productreport/productreport.component';

//Settings
import { ApplicationnotificationComponent } from 'app/modules/admin/settings/applicationnotification/applicationnotification.component';
import { GlobalsettingsComponent } from 'app/modules/admin/settings/globalSettings/globalsettings.component';
//import { MessagecenterComponent} from 'app/modules/admin/settings/messagecenter/messagecenter.component';

//Transactions
import { AllordersComponent } from 'app/modules/admin/transactions/allorders/allorders.component';
import { InvoicesComponent } from 'app/modules/admin/transactions/invoices/invoices.component';
import { PaymenthistoryComponent} from 'app/modules/admin/transactions/paymenthistory/paymenthistory.component';
import { UserreportComponent } from './modules/admin/reports/userreport/userreport.component';
import { ProductformComponent } from './modules/admin/inventory/products/productform/productform.component';
import { PageformComponent } from './modules/admin/pages/pageform/pageform.component';
import { FaqformComponent } from './modules/admin/faq/faqform/faqform.component';
import { DriversformComponent } from './modules/admin/accounts/drivers/driversform/driversform.component';
import { MerchantformComponent } from './modules/admin/accounts/merchants/merchantform/merchantform.component';
import { UsersformComponent } from './modules/admin/accounts/users/usersform/usersform.component';
import { EmailtemplatesformComponent } from './modules/admin/configuration/emailtemplates/emailtemplatesform/emailtemplatesform.component';
import { SmstemplatesformComponent } from './modules/admin/configuration/smstemplates/smstemplatesform/smstemplatesform.component';
import { PrivilegeformComponent } from './modules/admin/accesscontrol/privilege/privilegeform/privilegeform.component';


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

            // inventory
            {path: 'categories', component: CategoriesComponent},
            {path: 'products', component: ProductsComponent},
            {path: 'promocode', component: PromocodeComponent},

            {path: 'services', component: ServicesComponent},
            {path: 'pages', component: PagesComponent},
            {path: 'faq', component: FaqComponent},

            {path: 'allorders', component: AllordersComponent},
            {path: 'invoices', component: InvoicesComponent},

            {path: 'merchants', component: MerchantsComponent},
            {path: 'users', component: UsersComponent},
            {path: 'drivers', component: DriversComponent},

            {path: 'roles', component: RolesComponent},
            {path: 'groups', component: GroupsComponent},

            {path: 'driverreport', component: DriverreportComponent},
            {path: 'userreport', component: UserreportComponent},
            {path: 'merchantreport', component: MerchantreportComponent},
            {path: 'productsreport', component: ProductreportComponent},
            {path: 'ordersreport', component: OrdersreportComponent},

            {path: 'addservice', component: ServicesformComponent},
            {path: 'addservice/:id', component: ServicesformComponent},

            {path: 'addproduct', component: ProductformComponent},
            {path: 'addproduct/:id', component: ProductformComponent},

            {path: 'addpromocode', component: PromocodeformComponent},
            {path: 'addpromocode/:id', component: PromocodeformComponent},

            {path: 'addpromocode', component: PromocodeformComponent},
            {path: 'addpromocode/:id', component: PromocodeformComponent},

            {path: 'addPage', component: PageformComponent},
            {path: 'addPage/:id', component: PageformComponent},

            {path: 'addfaq', component: FaqformComponent},
            {path: 'addfaq/:id', component: FaqformComponent},

            {path: 'adddriver', component: DriversformComponent},
            {path: 'adddriver/:id', component: DriversformComponent},

            {path: 'addmerchant', component: MerchantformComponent},
            {path: 'addmerchant/:id', component: MerchantformComponent},

            {path: 'adduser', component: UsersformComponent},
            {path: 'adduser/:id', component: UsersformComponent},

            {path: 'globalsettings', component: GlobalsettingsComponent},

            {path: 'currency', component: CurrencyComponent},

            {path: 'paymentmethod', component: PaymentmethodsComponent},

            {path: 'smstemplates', component: SmstemplatesComponent},

            {path: 'emailtemplates', component: EmailtemplatesComponent},

            {path: 'applicationnotification', component: ApplicationnotificationComponent},

            {path: 'addemailtemplate', component: EmailtemplatesformComponent},
            {path: 'addemailtemplate/:id', component: EmailtemplatesformComponent},

            {path: 'addsmstemplate', component: SmstemplatesformComponent},
            {path: 'addsmstemplate/:id', component: SmstemplatesformComponent},

            {path: 'privileges', component: PrivilegeComponent},
            {path: 'addprivileges', component: PrivilegeformComponent},
            {path: 'addprivileges/:id', component: PrivilegeformComponent},
        ]
    }
];
