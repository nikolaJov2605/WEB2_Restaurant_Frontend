import { ProfileComponent } from './user/profile/profile.component';
import { LayoutsComponent } from './layouts/layouts.component';
import { CurrentOrdersComponent } from './layouts/customer/current-orders/current-orders.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { UserComponent } from './user/user.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesService } from './auth/roles.service';
import { CustomerComponent } from './layouts/customer/customer.component';
import { HomeComponent } from './layouts/customer/home/home.component';
import { OrdersComponent } from './layouts/customer/orders/orders.component';

const routes: Routes = [
  { path:'', redirectTo:'user/login', pathMatch:'full' },

  {
    path: 'user', component: UserComponent,
    children: [
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      { path: 'profile', component: ProfileComponent, }
    ]
  },
  {
    path:'layouts', component: LayoutsComponent,
    children: [
      {
      path:'customer', component: CustomerComponent,
        children: [
          { path: '', redirectTo:'home', pathMatch:'full' },
          { path: 'home', component: HomeComponent, },
          { path: 'orders', component: OrdersComponent },
          { path: 'current-orders', component: CurrentOrdersComponent }
        ]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
