import { AppModule, tokenGetter } from './../../app.module';
import { RolesService } from './../../auth/roles.service';
import { CustomerComponent } from './customer.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders/orders.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from '../../angular-material.module';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { AppRoutingModule } from '../../app-routing.module';
import { CookieService } from 'ngx-cookie-service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from 'src/app/auth/auth.interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { CurrentOrderComponent } from './current-order/current-order.component';
import { environment } from 'src/environments/environment';
import { JwtModule } from '@auth0/angular-jwt';



@NgModule({
  declarations: [
    OrdersComponent,
    HomeComponent,
    CurrentOrderComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: environment.allowedDomains
      }
    })
  ],
  providers:[
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
   }
  ],
  schemas:[
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class CustomerModule { }
