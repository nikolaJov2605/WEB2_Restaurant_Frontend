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
        const token = JSON.parse(localStorage.getItem('token') || '{}');     // decode the token to get its payload
        const tokenPayload = this.getDecodedToken(token);  
        console.log(tokenPayload);
        if (!this.auth.isAuthenticated() || tokenPayload.role !== expectedRole) {
            console.log(tokenPayload.role);
            this.router.navigate(['user/login']);
              return false;
        }
        return true;
  }
  getDecodedToken(token : string) : any{
      try{
          console.log(jwt_decode(token));
          return jwt_decode(token);
      }catch(Error){
          return null;
      }
  }
}