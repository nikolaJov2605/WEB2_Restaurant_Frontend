import { OrderService } from 'src/app/shared/services/order.service';
import { OrderModel } from './../../../shared/models/order.model';
import { HomeDelivererComponent } from './../home-deliverer/home-deliverer.component';
import { HomeComponent } from './../../customer/home/home.component';
import { Component, OnInit } from '@angular/core';
import { OrderTableModel } from 'src/app/shared/models/orderTable.model';
import { elementAt } from 'rxjs';

@Component({
  selector: 'app-current-delivery',
  templateUrl: './current-delivery.component.html',
  styleUrls: ['./current-delivery.component.scss']
})
export class CurrentDeliveryComponent implements OnInit {

  currentDelivery: OrderModel = new OrderModel;

  orderTableModel: OrderTableModel = new OrderTableModel;

  public timeLeftHours: number = 0;
  public timeLeftMinutes: number = 0;
  public timeLeftSeconds: number = 0;

  public timeWriter: string = "";

  seconds: number = 0;

  public delivered: boolean = false;

  constructor(public orderService: OrderService) { }

  ngOnInit(): void {

    const e = localStorage.getItem("email");
    let email = "";
    if (e != null)
      email = e;
    this.orderService.getTakenOrder(email).subscribe(
      data => {
        //console.log("podacici:");
        //console.log(data);
        this.currentDelivery = data;
        this.loadData();
      },
      error => {
        console.log(this.currentDelivery);
      }
    );
  }



  loadData(): void {
    let tA = "";
    if (this.currentDelivery.timeAccepted != null)
      tA = parseDateToString(this.currentDelivery.timeAccepted.toString());
    let tD = "";
    if (this.currentDelivery.timeDelivered != null)
      tD = parseDateToString(this.currentDelivery.timeDelivered.toString());
    let tP = parseDateToString(this.currentDelivery.timePosted.toString());
    if (this.currentDelivery.accepted == true) {
      this.orderService.getSecondsUntilDelivery(this.currentDelivery.id).subscribe(
        data => {
          this.seconds = data;
          if (this.seconds < 0) {
            return;
          }

          //console.log("sekunde: " + this.seconds);

          let timer = Timer.Instance(this, this.seconds);

        },
        error => {
          console.log(error);
        }
      );


    }
    let food = "";
    let cnt = 1;

    this.currentDelivery.orderedFood.forEach(foodElement => {
      let ingredients = "";
      foodElement.ingredients.forEach(ingredientElement => {
        if (ingredients == "")
          ingredients = ingredientElement.name;
        else
          ingredients += (", " + ingredientElement.name);
      });
      if (food == "")
        food = cnt + ". " + foodElement.name + " (" + foodElement.quantity + foodElement.unitOfMeasure + ") x" + foodElement.amount + " \n\tDodaci: " + ingredients;
      else
        food += ("\n " + cnt + ". " + foodElement.name + " (" + foodElement.quantity + foodElement.unitOfMeasure + ") x" + foodElement.amount + " \n\tDodaci: " + ingredients);
      ++cnt;
    });

    this.orderTableModel = {
      id: this.currentDelivery.id, food: food, timeDelivered: tD,
      timePosted: tP, timeAccepted: tA, price: this.currentDelivery.price, address: this.currentDelivery.address,
      comment: this.currentDelivery.comment, delivered: this.currentDelivery.delivered, customer: this.currentDelivery.userEmail,
      deliverer: this.currentDelivery.delivererEmail, status: ""
    };


    //console.log("trnutacna dostava:");
    //console.log(this.orderTableModel);
  }

  secondsToHms(d: number) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h.toString();
    var mDisplay = m.toString();
    var sDisplay = s.toString();
    return hDisplay + ":" + mDisplay + ":" + sDisplay;
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
  var stringBuilder = dayDelivered + "." + monthDelivered + "." + yearDelivered + ", " + hourDelivered + ":" + minuteDelivered + "h";

  return stringBuilder;
}


function delay(delay: number) {
  return new Promise(r => {
    setTimeout(r, delay);
  })
}


class Timer {
  private static _instance: Timer;

  private constructor(public delivery: CurrentDeliveryComponent, public seconds: number) {
    this.doTimer();
  }
  public static Instance(delivery: CurrentDeliveryComponent, seconds: number) {
    if (this._instance == null) {
      this._instance = new Timer(delivery, seconds);
    }
    return this._instance;
  }
  async doTimer() {
    while (this.seconds >= 0) {
      //console.log(this.seconds);
      await delay(1000);
      this.delivery.timeWriter = this.delivery.secondsToHms(this.seconds);
      console.log(this.delivery.timeWriter);
      this.seconds = this.seconds - 1;
    }

    this.delivery.delivered = true;

  }
}
