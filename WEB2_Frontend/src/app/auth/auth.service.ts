import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {  
    constructor(public jwtHelper: JwtHelperService) {}  // ...
    public isAuthenticated(): boolean 
    {
        const token = JSON.parse(localStorage.getItem('token') || '{}'); 
        console.log("token:")
        console.log(token);
        if(localStorage.getItem('token') != null)
        {
          //alert("token nije null");
          return !this.jwtHelper.isTokenExpired(token);
        }
        else
          return false;
    }
}