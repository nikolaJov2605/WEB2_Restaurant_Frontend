import { Injectable } from '@angular/core';
import { Router,CanActivate,ActivatedRouteSnapshot} from '@angular/router';
import { AuthService } from './auth.service';
import jwt_decode, {JwtPayload} from 'jwt-decode';

@Injectable()
export class RolesService implements CanActivate 
{  
    constructor(public auth: AuthService, public router: Router) {}  
    
    canActivate(route: ActivatedRouteSnapshot): boolean {
        const expectedRole = route.data['expectedRole'];
        const token = localStorage.getItem('token') || '{}';     // decode the token to get its payload
        const tokenPayload = this.getDecodedToken(token);
        var role = tokenPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        //console.log("role:");
        //console.log(role);
        if (!this.auth.isAuthenticated()) {
            console.log(tokenPayload.role);
            this.router.navigate(['user/login']);
              return false;
        }
        if(role !== expectedRole){
            //alert("gledam ulogu...");
            this.router.navigate(['user/login'])
        }
        return true;
  }
  getDecodedToken(token : string) : any{
      try{
          return jwt_decode(token);
      }catch(Error){
          return null;
      }
  }
}