import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { RegistrationModel } from '../models/registration.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginModel } from '../models/login.model';
import { TokenModel } from '../models/token.model';
import { VerificationModel } from '../models/verification.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor( private http: HttpClient) { }

  getAllDeliverers() : Observable<RegistrationModel[]>{
    return this.http.get<RegistrationModel[]>(environment.serverURL + '/api/users/all-deliverers');
  }

  register(formData:FormData) :Observable<Object> {
    return this.http.post<Object>(environment.serverURL + '/api/users/register', formData);
  }

  login(loginModel: LoginModel) :Observable<TokenModel> {
    return this.http.post<TokenModel>(environment.serverURL + '/api/users/login', loginModel);
  }

  getUserByEmail(email: string) : Observable<RegistrationModel> {
    return this.http.get<RegistrationModel>(environment.serverURL + `/api/users/${email}`);
  }

  updateUser(registrationModel:RegistrationModel) :Observable<Object> {
    return this.http.post<Object>(environment.serverURL + '/api/users/update-user', registrationModel);
  }

  /*getUsernameByEmail(email: string) : Observable<UsernameModel> {
    return this.http.get<UsernameModel>(environment.serverURL + `/api/users/get-username/${email}`)
  }*/

  verifyDeliverer(verification: VerificationModel): Observable<boolean> {
    return this.http.post<boolean>(environment.serverURL + '/api/users/verify-deliverer', verification);
  }

  unVerifyDeliverer(verification: VerificationModel): Observable<boolean> {
    return this.http.post<boolean>(environment.serverURL + '/api/users/unverify-deliverer', verification);
  }

  denyDeliverer(verification: VerificationModel): Observable<boolean> {
    return this.http.post<boolean>(environment.serverURL + '/api/users/deny-deliverer', verification);
  }

}
