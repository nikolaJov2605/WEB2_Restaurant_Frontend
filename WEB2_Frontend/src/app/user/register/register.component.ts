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

  formData: FormData = new FormData();
  image: any;
  fileUploaded: boolean = false;

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

    this.formData.append('name', this.registrationForm.controls['Name'].value);
    this.formData.append('lastname', this.registrationForm.controls['LastName'].value);
    this.formData.append('email', this.registrationForm.controls['Email'].value);
    this.formData.append('username', this.registrationForm.controls['UserName'].value);
    this.formData.append('password', this.registrationForm.controls['Password'].value);
    this.formData.append('address', this.registrationForm.controls['Address'].value);
    this.formData.append('birthDate', this.registrationForm.controls['Date'].value);
    this.formData.append('userType', this.registrationForm.controls['UserType'].value);
    

    if(this.fileUploaded == true)
    {
      if(isImage(this.image.name) == true){
        this.formData.append('image', this.image);
      }
      else{
        alert("Izaberite sliku za upload!");
        return;
      }
    }

    this.service.register(this.formData).subscribe(
      data =>{
        this.router.navigateByUrl("/user/login");
      },
      error=>{
        console.log(this.formData);
        
        alert('Error.')
      }
    );
  }

  onFileInput(event: any){
    this.image = event?.target?.files[0];
    this.fileUploaded = true;
  }

  

}

function getExtension(filename: string) {
  var parts = filename.split('.');
  return parts[parts.length - 1];
}

function isImage(filename: string) {
  var ext = getExtension(filename);
  switch (ext.toLowerCase()) {
    case 'jpg':
    case 'bmp':
    case 'png':
      //etc
      return true;
  }
  return false;
}