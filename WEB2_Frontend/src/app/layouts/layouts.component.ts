import { LayoutsModule } from './layouts.module';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
    selector: 'app-layouts',
    templateUrl: './layouts.component.html',
    styleUrls: ['./layouts.component.scss']
})

export class LayoutsComponent implements OnInit {

    constructor(private jwtHelper: JwtHelperService, private router:Router) {}
  
    ngOnInit(): void {
      const token = localStorage.getItem("token");
      if (token && !this.jwtHelper.isTokenExpired(token)){
        const decoded = this.jwtHelper.decodeToken(token);
        var role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        if(role =="admin"){
            this.router.navigate(["layouts/admin"]);
        }
        if(role =="customer"){
          this.router.navigate(["layouts/customer/home"]);
        }
        if(role =="deliverer"){
          this.router.navigate(["layouts/deliverer"]);
        }
      
      }
      else{
        localStorage.removeItem('token');
        this.router.navigate(['user/login']);
      }
      
    }
  
}
  