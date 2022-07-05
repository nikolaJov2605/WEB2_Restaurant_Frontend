import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { LoginModel } from 'src/app/shared/models/login.model';
import { TokenModel } from 'src/app/shared/models/token.model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = new UntypedFormGroup({
    email : new UntypedFormControl("", [Validators.email, Validators.required]),
    password : new UntypedFormControl("", Validators.required),
  });
  constructor(private service: UserService, private router: Router, private jwtHelper: JwtHelperService) { }

  ngOnInit(): void {
    if (localStorage.getItem('token') != null){
      this.checkClaim();
      //this.router.navigateByUrl('layouts');
    }
  }

  onSubmit() {
    let login: LoginModel = new LoginModel();
    login.email = this.loginForm.controls['email'].value;
    login.password = this.loginForm.controls['password'].value;
    console.log(login.email);
    console.log(login.password);
    this.service.login(login).subscribe(
      (data : TokenModel) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', login.email);
        localStorage.setItem('loaded', 'true');
        //this.router.navigateByUrl('layouts');
        this.checkClaim();
      },
      error => {
          alert('Authentication failed.')
      }
    );
  }

  checkClaim(){
    const token = localStorage.getItem("token");
      if (token && !this.jwtHelper.isTokenExpired(token)){
        const decoded = this.jwtHelper.decodeToken(token);
        var role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        if(role =="admin"){
            this.router.navigate(["admin"]);
        }
        if(role =="customer"){
          this.router.navigate(["customer"]);
        }
        if(role =="deliverer"){
          this.router.navigate(["deliverer"]);
        }
      
      }
      else{
        localStorage.removeItem('token');
        this.router.navigate(['user/login']);
      }
  }
}
