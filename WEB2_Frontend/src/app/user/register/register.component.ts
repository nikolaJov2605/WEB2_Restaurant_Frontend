import { UserService } from './../../shared/services/user.service';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrationModel } from 'src/app/shared/models/registration.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registrationForm = new UntypedFormGroup({
    UserName: new UntypedFormControl('', Validators.required),
    Name: new UntypedFormControl('', Validators.required),
    LastName: new UntypedFormControl('', Validators.required),
    Password: new UntypedFormControl('', [Validators.required, Validators.minLength(4)]),
    RepeatedPassword: new UntypedFormControl('', [Validators.required, Validators.minLength(4)]),
    Email: new UntypedFormControl('', [Validators.email, Validators.required]),
    Address: new UntypedFormControl('', Validators.required),
    Date: new UntypedFormControl('', Validators.required),
    UserType: new UntypedFormControl('', Validators.required)
  });

  constructor(public service: UserService, private router: Router, private fomBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if(this.registrationForm.controls['Password'].value != this.registrationForm.controls['RepeatedPassword'].value)
    {
      alert("Repeated password failed");
      console.log("Passwd:" + this.registrationForm.controls['Password'].value);
      console.log("Passwd2:" + this.registrationForm.controls['RepeatedPassword'].value);
      return;
    }
    let regModel = new RegistrationModel();
    regModel.name = this.registrationForm.controls['Name'].value
    regModel.lastname = this.registrationForm.controls['LastName'].value
    regModel.email = this.registrationForm.controls['Email'].value
    regModel.username = this.registrationForm.controls['UserName'].value
    regModel.password = this.registrationForm.controls['Password'].value
    regModel.address = this.registrationForm.controls['Address'].value
    regModel.birthDate = this.registrationForm.controls['Date'].value
    regModel.userType = this.registrationForm.controls['UserType'].value
    

    this.service.register(regModel).subscribe(
      data =>{
        this.router.navigateByUrl("/user/login");
      },
      error=>{
        console.log(regModel);
        
        alert('Error.')
      }
    );
  }

}
