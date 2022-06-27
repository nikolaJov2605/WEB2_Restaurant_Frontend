import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  public authorised:boolean = false;

  ngOnInit(): void {
    if (localStorage.getItem('token') != null) {
      this.authorised = true;
    }
    else{
      this.authorised = false;
    }
  }

}
