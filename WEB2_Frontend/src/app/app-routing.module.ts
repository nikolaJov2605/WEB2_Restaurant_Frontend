import { HomeComponent } from './layouts/customer/home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { OrdersComponent } from './layouts/customer/orders/orders.component';
import { LayoutsComponent } from './layouts/layouts.component';
import { CustomerComponent } from './layouts/customer/customer.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { UserComponent } from './user/user.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path:'', redirectTo:'user/login', pathMatch:'full' },

  {
    path: 'user', component: UserComponent,
    children: [
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent }
    ]
  },
  { 
    path:'layouts', component: LayoutsComponent,
    children: [
      { 
        path: 'customer', component: CustomerComponent,
        children:[
          { path: 'home', component: HomeComponent },
          { path: 'orders', component: OrdersComponent },

        ] 
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
