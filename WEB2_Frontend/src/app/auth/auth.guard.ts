import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(private router: Router, private cookieService:CookieService, private auth: AuthService, private jwtHelper: JwtHelperService) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.auth.isAuthenticated()){
        // decode the token to get its payload
      const token = localStorage.getItem("token");
      if (token && !this.jwtHelper.isTokenExpired(token)){
        console.log(this.jwtHelper.decodeToken(token))
     
      }
      return true;
    }
    else {
      this.router.navigate(['/user/login']);
      return false;
    }

  }
}