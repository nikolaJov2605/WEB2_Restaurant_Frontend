import { JwtHelperService } from '@auth0/angular-jwt';
import { RegistrationModel } from 'src/app/shared/models/registration.model';
import { UserService } from 'src/app/shared/services/user.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router, private jwtHelper: JwtHelperService, private _sanitizer: DomSanitizer) { }

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

  imageData: any;  
  sanitizedImageData: any;  

  public verificationStatus: string = "";

  formData: FormData = new FormData();
  image: any;
  fileUploaded: boolean = false;

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
        this.userType = data.userType;
        
        this.updateProfileForm.controls['Name'].setValue(this.user.name);
        this.updateProfileForm.controls['LastName'].setValue(this.user.lastname);
        this.updateProfileForm.controls['Email'].setValue(this.user.email);
        this.updateProfileForm.controls['UserName'].setValue(this.user.username);
        this.updateProfileForm.controls['Address'].setValue(this.user.address);
        this.updateProfileForm.controls['Date'].setValue(this.user.birthDate);
        this.updateProfileForm.controls['UserType'].setValue(this.user.userType);

        this.userService.getUserImage(email).subscribe(
          data=>{
            console.log(data);
            this.picture = data;
            this.imageData = 'data:image/png;base64,' + this.picture;
          },
          error=>{
            console.log(error);
          }
        );

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
    
    this.formData.append('name', this.updateProfileForm.controls['Name'].value);
    this.formData.append('lastname', this.updateProfileForm.controls['LastName'].value);
    this.formData.append('email', this.updateProfileForm.controls['Email'].value);
    this.formData.append('username', this.updateProfileForm.controls['UserName'].value);
    this.formData.append('password', this.updateProfileForm.controls['Password'].value);
    this.formData.append('address', this.updateProfileForm.controls['Address'].value);
    this.formData.append('birthDate', this.updateProfileForm.controls['Date'].value);
    this.formData.append('userType', this.updateProfileForm.controls['UserType'].value);

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


    
    this.userService.updateUser(this.formData).subscribe(
      data =>{
        /*let newPath = "/user/profile";// + this.formData.username;
        this.router.navigateByUrl(newPath);*/
        const e = localStorage.getItem("email");
        let email = "";
        if(e != null)
          email = e;
        this.userService.getUserByEmail(email).subscribe(
          data=>{
            //console.log("Evo podaci bajo:");
            //console.log(data);
            this.user = data;
            this.userType = data.userType;
            
            this.updateProfileForm.controls['Name'].setValue(this.user.name);
            this.updateProfileForm.controls['LastName'].setValue(this.user.lastname);
            this.updateProfileForm.controls['Email'].setValue(this.user.email);
            this.updateProfileForm.controls['UserName'].setValue(this.user.username);
            this.updateProfileForm.controls['Address'].setValue(this.user.address);
            this.updateProfileForm.controls['Date'].setValue(this.user.birthDate);
            this.updateProfileForm.controls['UserType'].setValue(this.user.userType);
    
            this.userService.getUserImage(email).subscribe(
              data=>{
                console.log(data);
                this.picture = data;
                this.imageData = 'data:image/png;base64,' + this.picture;
                this.fileUploaded = false;
              },
              error=>{
                console.log(error);
              }
            );
    
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
      },
      error=>{
        console.log(this.formData);
        
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