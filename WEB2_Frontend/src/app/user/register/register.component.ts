import { UserService } from './../../shared/services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrationModel } from 'src/app/shared/models/registration.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registrationForm = new FormGroup({
    UserName: new FormControl('', Validators.required),
    Name: new FormControl('', Validators.required),
    LastName: new FormControl('', Validators.required),
    Password: new FormControl('', [Validators.required, Validators.minLength(4)]),
    RepeatedPassword: new FormControl('', [Validators.required, Validators.minLength(4)]),
    Email: new FormControl('', Validators.email),
    Address: new FormControl('', Validators.required),
    Date: new FormControl('', Validators.required),
    AccountType: new FormControl('', Validators.required)
  });

  constructor(public service: UserService, private router: Router, private fomBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  onSubmit() {
    let regModel = new RegistrationModel();
    regModel.name = this.registrationForm.controls['Name'].value
    regModel.lastname = this.registrationForm.controls['LastName'].value
    regModel.email = this.registrationForm.controls['Email'].value
    regModel.username = this.registrationForm.controls['UserName'].value
    regModel.password = this.registrationForm.controls['Password'].value
    regModel.repeatedPassword = this.registrationForm.controls['RepeatedPassword'].value
    regModel.address = this.registrationForm.controls['Address'].value
    regModel.dateOfBirth = this.registrationForm.controls['Date'].value
    regModel.accountType = this.registrationForm.controls['AccountType'].value

    
    this.service.register(regModel).subscribe(
      data =>{
        this.router.navigateByUrl("/user/login");
      },
      error=>{
        alert('Error.')
      }
    );
  }

}
