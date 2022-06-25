import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { RegistrationModel } from '../models/registration.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginModel } from '../models/login.model';
import { TokenModel } from '../models/token.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor( private http: HttpClient) { }

  register(registrationModel:RegistrationModel) :Observable<Object> {
    return this.http.post<Object>(environment.serverURL + '/api/users/register', registrationModel);
  } // izmeni serverUrl na odgovarajuci

  login(loginModel: LoginModel) :Observable<TokenModel> {
    return this.http.post<TokenModel>(environment.serverURL + '/api/users/login', loginModel);
  }

}
