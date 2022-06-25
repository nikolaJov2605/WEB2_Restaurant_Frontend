import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { LoginModel } from 'src/app/shared/models/login.model';
import { TokenModel } from 'src/app/shared/models/token.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email : new FormControl("", Validators.required),
    password : new FormControl("", Validators.required),
  });
  constructor(private service: UserService, private router: Router) { }

  ngOnInit(): void {
    if (localStorage.getItem('token') != null)
      this.router.navigateByUrl('layouts/default');
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
      },
      error => {
          alert('Authentication failed.')
      }
    );
  }
}
