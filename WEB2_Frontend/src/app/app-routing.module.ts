import { DeliveriesComponent } from './layouts/deliverer/deliveries/deliveries.component';
import { CurrentDeliveryComponent } from './layouts/deliverer/current-delivery/current-delivery.component';
import { HomeDelivererComponent } from './layouts/deliverer/home-deliverer/home-deliverer.component';
import { ProfileComponent } from './user/profile/profile.component';
import { LayoutsComponent } from './layouts/layouts.component';
import { CurrentOrderComponent } from './layouts/customer/current-order/current-order.component';
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
import { DelivererComponent } from './layouts/deliverer/deliverer.component';

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
          { path: 'current-order', component: CurrentOrderComponent }
        ]
      },
      {
        path:'deliverer', component: DelivererComponent,
          children: [
            { path: '', redirectTo:'home', pathMatch:'full' },
            { path: 'home', component: HomeDelivererComponent },
            { path: 'my-deliveries', component: DeliveriesComponent },
            { path: 'current-delivery', component: CurrentDeliveryComponent }
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
