import { JwtHelperService } from '@auth0/angular-jwt';
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

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router, private jwtHelper: JwtHelperService, private reader: FileReader) { }

  username: string = "";
  public user: RegistrationModel = new RegistrationModel;
  public userType: string = "";

  public picture: any;

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


  public verificationStatus: string = "";


  ngOnInit(): void {
    //this.userType = this.updateProfileForm.controls['UserType'].value;
    const e = localStorage.getItem("email");
    let email = "";
    if(e != null)
      email = e;

    this.userService.getUserByEmail(email).subscribe(
      data=>{
        //console.log("Evo podaci bajo:");
        //console.log(data);
        this.user = data;
        let img = new Blob();
        //this.picture = this.reader.readAsDataURL(data.image);
        this.picture = this.reader.readAsDataURL(data.image);
        //this.picture = new File(data.image, "");
        console.log(this.picture);
        this.userType = data.userType;
        
        this.updateProfileForm.controls['Name'].setValue(this.user.name);
        this.updateProfileForm.controls['LastName'].setValue(this.user.lastname);
        this.updateProfileForm.controls['Email'].setValue(this.user.email);
        this.updateProfileForm.controls['UserName'].setValue(this.user.username);
        this.updateProfileForm.controls['Address'].setValue(this.user.address);
        this.updateProfileForm.controls['Date'].setValue(this.user.birthDate);
        this.updateProfileForm.controls['UserType'].setValue(this.user.userType);

        if(this.userType == 'deliverer'){
          if(this.user.denied == true)
          {
            this.verificationStatus = "ODBIJEN";
          }
          if(this.user.verified == false && this.user.denied == false)
          {
            this.verificationStatus = "NA ČEKANjU";
          }
          if(this.user.verified == true)
          {
            this.verificationStatus = "VERIFIKOVAN";
          }
        }
        

      },
      error=>{
        console.log("error");
        //console.log(this.userType);
        this.checkClaim();
      }
    )
  }

  onSubmit(){
    /*if(this.updateProfileForm.controls['Password'].value != this.updateProfileForm.controls['RepeatedPassword'].value)
    {
      alert("Repeated password failed");
      console.log("Passwd:" + this.updateProfileForm.controls['Password'].value);
      console.log("Passwd2:" + this.updateProfileForm.controls['RepeatedPassword'].value);
      return;
    }*/
    let regModel = new RegistrationModel();
    regModel.name = this.updateProfileForm.controls['Name'].value;
    regModel.lastname = this.updateProfileForm.controls['LastName'].value;
    regModel.email = this.updateProfileForm.controls['Email'].value;
    regModel.username = this.updateProfileForm.controls['UserName'].value;
    //regModel.password = this.updateProfileForm.controls['Password'].value;
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

  checkClaim(){
    const token = localStorage.getItem("token");
      if (token && !this.jwtHelper.isTokenExpired(token)){
        const decoded = this.jwtHelper.decodeToken(token);
        var role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        if(role =="admin"){
            this.router.navigate(["layouts/admin"]);
        }
        if(role =="customer"){
          this.router.navigate(["layouts/customer"]);
        }
        if(role =="deliverer"){
          this.router.navigate(["layouts/deliverer"]);
        }
      
      }
      else{
        localStorage.removeItem('token');
        this.router.navigate(['user/login']);
      }
  }

}
