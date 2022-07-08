import { UserService } from 'src/app/shared/services/user.service';
import { NavbarModel } from '../../shared/models/navbar.model';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private jwtHelper: JwtHelperService, private router: Router, private userService: UserService) { }

  public authorised: boolean = false;

  public navbarModel: NavbarModel = new NavbarModel;

  public navigationList: string[] = [];

  public roleStr: string = "";
  private username: string = "";

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
    switch (btn) {
      case "Početna":
        if (this.roleStr == "admin") {
          //this.router.navigate('layouts/admin'); redirekcija na admin-homepage
        }
        else if (this.roleStr == "deliverer") {
          this.router.navigate(['layouts/deliverer']);
        }
        else if (this.roleStr == "customer") {
          this.router.navigate(['layouts/customer']);
        }
        break;
      case "Moj profil":
        this.router.navigate(["user/profile/"]);
        break;
      case "Odjava":
        localStorage.clear();
        this.router.navigate(['user/login']);
        break;
      case "Moje narudžbine":
        this.router.navigate(['layouts/customer/orders']);
        break;
      case "Trenutna narudžbina":
        this.router.navigate(['layouts/customer/current-order']);
        break;
      case "Moje dostave":
        this.router.navigate(['layouts/deliverer/my-deliveries']);
        break;
      case "Trenutna dostava":
        this.router.navigate(['layouts/deliverer/current-delivery']);
        break;
      case "Narudžbine":
        this.router.navigate(['layouts/admin/orders']);
        break;
      default:
        return;
    }
    /*if(btn == "Početna") {
      if(this.roleStr == "admin") {
        //this.router.navigate('admin'); redirekcija na admin-homepage
      }
      else if(this.roleStr == "deliverer") {
        //this.router.navigate('deliverer'); redirekcija na deliverer-homepage
      }
      else if(this.roleStr == "customer") {
        this.router.navigate(['customer']);
      }
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
    }*/
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

