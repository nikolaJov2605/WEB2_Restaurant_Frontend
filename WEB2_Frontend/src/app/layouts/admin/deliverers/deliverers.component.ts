import { VerificationModel } from './../../../shared/models/verification.model';
import { UserService } from 'src/app/shared/services/user.service';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RegistrationModel } from 'src/app/shared/models/registration.model';
import { DelivererTableModel } from 'src/app/shared/models/delivererTable.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deliverers',
  templateUrl: './deliverers.component.html',
  styleUrls: ['./deliverers.component.scss']
})
export class DeliverersComponent implements OnInit {

  allUsers: RegistrationModel[] = [];
  userTableModel: DelivererTableModel = new DelivererTableModel;
  userTable: DelivererTableModel[] = [];

  verified: boolean = false;

  userDataSource = new MatTableDataSource();
  displayedUserColumnsList: string[] = ['username', 'email', 'name', 'lastname', 'birthDate', 'address', 'verified', 'btnVerify'];

  public verification: VerificationModel = new VerificationModel;
  
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.userService.getAllDeliverers().subscribe(
      (data : RegistrationModel[]) => {
        this.allUsers = data;
        //console.log("korisnici:");
        //console.log(data);
        this.loadTable();
      },
      error => {
        alert('Došlo je do greške, molimo pokušajte kasnije.');
        console.log(error);
      }
    );
  }

  verify(deliverer: DelivererTableModel){
    this.verification.username = deliverer.username;
    this.userService.verifyDeliverer(this.verification).subscribe(
      data=>{
        window.location.reload();
      },
      error=>{
        alert("Došlo je do greške, molimo pokušajte kasnije");
        console.log(error);
      }
    );
  }

  unVerify(deliverer: DelivererTableModel){
    this.verification.username = deliverer.username;
    this.userService.unVerifyDeliverer(this.verification).subscribe(
      data=>{
        window.location.reload();
      },
      error=>{
        alert("Došlo je do greške, molimo pokušajte kasnije");
        console.log(error);
      }
    );
  }

  deny(deliverer: DelivererTableModel){
    this.verification.username = deliverer.username;
    this.userService.denyDeliverer(this.verification).subscribe(
      data=>{
        window.location.reload();
      },
      error=>{
        alert("Došlo je do greške, molimo pokušajte kasnije");
        console.log(error);
      }
    );
  }


  loadTable(): void{
    this.allUsers.forEach(element => {
      let tB = "";
      if(element.birthDate != null)
        tB = parseDateToString(element.birthDate.toString());
      
      let food = "";
      let cnt = 1;
      

      this.userTable.push({username: element.username, name: element.name, lastname: element.lastname, email: element.email, address: element.address, verified: element.verified, birthDate: tB, denied: element.denied})
      this.userDataSource.data = this.userTable;
      console.log(this.userTable);
        
    });
  }
}



function parseDateToString(date: string) {
    let yearDelivered = date.substring(0, 4);
    let monthDelivered = date.substring(5, 7);
    if (monthDelivered.startsWith('0'))
      monthDelivered = monthDelivered.substring(1);

    let dayDelivered = date.substring(8, 10);
    if (dayDelivered.startsWith('0'))
      dayDelivered = dayDelivered.substring(1);
    let hourDelivered = date.substring(11, 13);
    let minuteDelivered = date.substring(14, 16);
    var stringBuilder = dayDelivered + "." + monthDelivered + "." + yearDelivered + ".";

    return stringBuilder;
}
