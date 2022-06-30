import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private jwtHelper: JwtHelperService, private router:Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem("token");
    if (token && !this.jwtHelper.isTokenExpired(token)){
      const decoded = this.jwtHelper.decodeToken(token);
      var role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      if(role =="admin"){
          this.router.navigate(["home/admin"]);
      }
      if(role =="customer"){
        this.router.navigate(["home/customer"]);
      }
      if(role =="deliverer"){
        this.router.navigate(["home/deliverer"]);
      }
    
    }
    else{
      localStorage.removeItem('token');
      this.router.navigate(['user/login']);
    }
    
  }

}
