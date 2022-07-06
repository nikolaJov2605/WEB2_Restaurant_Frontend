import { NavbarModel } from './../shared/models/navbar.model';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private jwtHelper: JwtHelperService, private router: Router) { }

  public authorised: boolean = false;

  public navbarModel: NavbarModel = new NavbarModel;

  public navigationList: string[] = [];

  public roleStr: string = "";

  ngOnInit(): void {
    this.checkClaim();
    if (localStorage.getItem('token') != null) {
      this.authorised = true;
    }
    else {
      this.authorised = false;
    }
  }

  onNavBarClick(btn: string) {
    if(btn == "Početna") {
      if(this.roleStr == "admin") {
        //this.router.navigate('admin'); redirekcija na admin-homepage
      }
      else if(this.roleStr == "deliverer") {
        //this.router.navigate('deliverer'); redirekcija na deliverer-homepage
      }
      else if(this.roleStr == "customer") {
        this.router.navigate(['customer']);
      }

    }
    else if(btn == "Moj profil") {
      if(this.roleStr == "admin") {
        //this.router.navigate('admin'); redirekcija na profil admina
      }
      else if(this.roleStr == "deliverer") {
        //this.router.navigate('deliverer'); redirekcija na profil dostavljaca
      }
      else if(this.roleStr == "customer") {
        //this.router.navigate(['customer']); redirekcija na profil kupca
      }
    }
    
    else if(btn == "Odjava") {
      localStorage.clear();
      this.router.navigate(['user/login']);
    }
  }



  checkClaim() {
    const token = localStorage.getItem("token");
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decoded = this.jwtHelper.decodeToken(token);
      var role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      if (role == "admin") {
        this.navigationList = this.navbarModel.adminNavbar;
        this.roleStr = "admin"
      }
      if (role == "customer") {
        this.navigationList = this.navbarModel.customerNavbar;
        this.roleStr = "customer"
      }
      if (role == "deliverer") {
        this.navigationList = this.navbarModel.delivererNavbar;
        this.roleStr = "deliverer"
      }

    }
    else {
      localStorage.removeItem('token');
      this.navigationList = this.navbarModel.unauthorizedNavbar;
      console.log(this.navigationList);
      this.router.navigate(['user/login']);
    }
  }
}

