import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeDelivererComponent } from './home-deliverer/home-deliverer.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AngularMaterialModule } from './../../angular-material.module';
import { DelivererComponent } from './deliverer.component';
import { CookieService } from 'ngx-cookie-service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from 'src/app/auth/auth.interceptor';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { CurrentDeliveryComponent } from './current-delivery/current-delivery.component';



@NgModule({
  declarations: [
    HomeDelivererComponent,
    DelivererComponent,
    CurrentDeliveryComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    AppRoutingModule,
  ],
  providers: [
    HomeDelivererComponent,
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
export class DelivererModule { }
