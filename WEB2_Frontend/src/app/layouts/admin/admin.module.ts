import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from '../../angular-material.module';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { AppRoutingModule } from '../../app-routing.module';
import { DeliverersComponent } from './deliverers/deliverers.component';
import { environment } from 'src/environments/environment';
import { JwtModule } from '@auth0/angular-jwt';
import { tokenGetter } from 'src/app/app.module';
import { CookieService } from 'ngx-cookie-service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from 'src/app/auth/auth.interceptor';
import { FoodComponent } from './food/food.component';
import { FoodDialogComponent } from './food-dialog/food-dialog.component';
import { IngredientDialogComponent } from './ingredient-dialog/ingredient-dialog.component';


@NgModule({
  declarations: [
    AdminComponent,
    AdminOrdersComponent,
    DeliverersComponent,
    FoodComponent,
    FoodDialogComponent,
    IngredientDialogComponent,
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: environment.allowedDomains
      }
    })
  ],
  providers: [
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
export class AdminModule { }
