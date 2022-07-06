import { RegistrationModel } from 'src/app/shared/models/registration.model';
import { UserService } from 'src/app/shared/services/user.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) { }

  username: string = "";
  user: RegistrationModel = new RegistrationModel;

  updateProfileForm = new UntypedFormGroup({
    UserName: new UntypedFormControl('', Validators.required),
    Name: new UntypedFormControl('', Validators.required),
    LastName: new UntypedFormControl('', Validators.required),
    Password: new UntypedFormControl('', [Validators.required, Validators.minLength(4)]),
    RepeatedPassword: new UntypedFormControl('', [Validators.required, Validators.minLength(4)]),
    Email: new UntypedFormControl({value: '', disabled: true}),
    Address: new UntypedFormControl('', Validators.required),
    Date: new UntypedFormControl({value: '', disabled: true}),
    UserType: new UntypedFormControl({value: '', disabled: true})
  });


  ngOnInit(): void {
    const temp = this.route.snapshot.paramMap.get('username');
    if(temp != null)
      this.username = temp;

    this.userService.getUserByUsername(this.username).subscribe(
      data=>{
        console.log("Evo podaci bajo:");
        console.log(data);
        this.user = data;
        
        this.updateProfileForm.controls['Name'].setValue(this.user.name);
        this.updateProfileForm.controls['LastName'].setValue(this.user.lastname);
        this.updateProfileForm.controls['Email'].setValue(this.user.email);
        this.updateProfileForm.controls['UserName'].setValue(this.user.username);
        this.updateProfileForm.controls['Address'].setValue(this.user.address);
        this.updateProfileForm.controls['Date'].setValue(this.user.birthDate);
        this.updateProfileForm.controls['UserType'].setValue(this.user.userType);

      },
      error=>{
        console.log("error");
      }
    )
  }

  onSubmit(){
    if(this.updateProfileForm.controls['Password'].value != this.updateProfileForm.controls['RepeatedPassword'].value)
    {
      alert("Repeated password failed");
      console.log("Passwd:" + this.updateProfileForm.controls['Password'].value);
      console.log("Passwd2:" + this.updateProfileForm.controls['RepeatedPassword'].value);
      return;
    }
    let regModel = new RegistrationModel();
    regModel.name = this.updateProfileForm.controls['Name'].value;
    regModel.lastname = this.updateProfileForm.controls['LastName'].value;
    regModel.email = this.updateProfileForm.controls['Email'].value;
    regModel.username = this.updateProfileForm.controls['UserName'].value;
    regModel.password = this.updateProfileForm.controls['Password'].value;
    regModel.address = this.updateProfileForm.controls['Address'].value;
    regModel.birthDate = this.updateProfileForm.controls['Date'].value;
    regModel.userType = this.updateProfileForm.controls['UserType'].value;
    
    this.userService.updateUser(regModel).subscribe(
      data =>{
        let newPath = "/user/profile/" + regModel.username;
        this.router.navigateByUrl(newPath);
      },
      error=>{
        console.log(regModel);
        
        alert('Error.')
      }
    );
  }

}
