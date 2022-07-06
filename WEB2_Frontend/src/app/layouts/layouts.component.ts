import { NavbarComponent } from './../navbar/navbar.component';
import { NavbarModel } from './../shared/models/navbar.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-layouts',
  templateUrl: './layouts.component.html',
  styleUrls: ['./layouts.component.scss']
})
export class LayoutsComponent implements OnInit {

  private vavbarModel: NavbarModel = new NavbarModel;
  constructor(private jwtHelper: JwtHelperService, private router: Router) { }

  ngOnInit(): void {
    
  }
}
