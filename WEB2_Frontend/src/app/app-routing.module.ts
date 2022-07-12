import { FoodComponent } from './layouts/admin/food/food.component';
import { AdminOrdersComponent } from './layouts/admin/admin-orders/admin-orders.component';
import { AdminComponent } from './layouts/admin/admin.component';
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
import { DeliverersComponent } from './layouts/admin/deliverers/deliverers.component'
import { DelivererComponent } from './layouts/deliverer/deliverer.component';

const routes: Routes = [
  { path:'', redirectTo:'user/login', pathMatch:'full' },
  {
    path: 'user', component: UserComponent,
    children: [
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      { path: 'profile', component: ProfileComponent, canActivate:[AuthGuard], }
    ]
  },
  {
    path:'layouts', component: LayoutsComponent, canActivate:[AuthGuard],
    children: [
      {
      path:'customer', component: CustomerComponent, canActivate:[RolesService], data:{expectedRole: 'customer'},
        children: [
          { path: '', redirectTo:'home', pathMatch:'full'},
          { path: 'home', component: HomeComponent, canActivate:[RolesService], data:{expectedRole: 'customer'}},
          { path: 'orders', component: OrdersComponent, canActivate:[RolesService], data:{expectedRole: 'customer'} },
          { path: 'current-order', component: CurrentOrderComponent, canActivate:[RolesService], data:{expectedRole: 'customer'} }
        ]
      },
      {
        path:'deliverer', component: DelivererComponent, canActivate:[RolesService], data:{expectedRole: 'deliverer'},
          children: [
            { path: '', redirectTo:'home', pathMatch:'full' },
            { path: 'home', component: HomeDelivererComponent, canActivate:[RolesService], data:{expectedRole: 'deliverer'} },
            { path: 'my-deliveries', component: DeliveriesComponent, canActivate:[RolesService], data:{expectedRole: 'deliverer'} },
            { path: 'current-delivery', component: CurrentDeliveryComponent, canActivate:[RolesService], data:{expectedRole: 'deliverer'} }
          ]
      },
      {
        path: 'admin', component: AdminComponent, canActivate:[RolesService], data:{expectedRole: 'admin'},
        children: [
          { path: '', redirectTo: 'deliverers', pathMatch: 'full' },
          { path: 'food', component: FoodComponent, canActivate:[RolesService], data:{expectedRole: 'admin'} },
          { path: 'orders', component: AdminOrdersComponent, canActivate:[RolesService], data:{expectedRole: 'admin'} },
          { path: 'deliverers', component: DeliverersComponent, canActivate:[RolesService], data:{expectedRole: 'admin'} },
        ]
      }
    ]
  },
  {
    path:"**",
    redirectTo:'user/login'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
