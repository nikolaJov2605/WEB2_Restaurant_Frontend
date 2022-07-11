import { AdminComponent } from './layouts/admin/admin.component';
import { DelivererModule } from './layouts/deliverer/deliverer.module';
import { ProfileComponent } from './user/profile/profile.component';
import { LayoutsModule } from './layouts/layouts.module';
import { LayoutsComponent } from './layouts/layouts.component';

import { CustomerComponent } from './layouts/customer/customer.component';
import { CustomerModule } from './layouts/customer/customer.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AngularMaterialModule } from './angular-material.module';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { environment } from 'src/environments/environment';
import { JwtModule } from '@auth0/angular-jwt';

import { CookieService } from 'ngx-cookie-service';
import { AuthInterceptor } from './auth/auth.interceptor';
import { RolesService } from './auth/roles.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { AdminModule } from './layouts/admin/admin.module';

export function tokenGetter() {
  return localStorage.getItem("token");
}

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent
    //LayoutsComponent,
    //NavbarComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: environment.allowedDomains
      }
    }),
    LayoutsModule,
    CustomerModule,
    DelivererModule,
    AdminModule
  ],
  providers: [
    //RolesService,
    //NavbarComponent,
    FileReader,
    CookieService,
    {
       provide: HTTP_INTERCEPTORS,
       useClass: AuthInterceptor,
       multi: true,
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
