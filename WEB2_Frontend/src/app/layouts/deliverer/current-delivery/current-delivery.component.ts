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

  seconds: number = 0;

  public delivered: boolean = false;

  constructor(public orderService: OrderService) { }

  ngOnInit(): void {

    const e = localStorage.getItem("email");
    let email = "";
    if(e != null)
      email = e;
    this.orderService.getTakenOrder(email).subscribe(
      data=>{
        console.log("podacici:");
        console.log(data);
        this.currentDelivery = data;
        this.loadData();
      },
      error=>{
        console.log(this.currentDelivery);
      }
    );
  }



  loadData(): void {
      let tA = "";
      if(this.currentDelivery.timeAccepted != null)
        tA = parseDateToString(this.currentDelivery.timeAccepted.toString());
      let tD = "";
      if(this.currentDelivery.timeDelivered != null)
        tD = parseDateToString(this.currentDelivery.timeDelivered.toString());
      let tP = parseDateToString(this.currentDelivery.timePosted.toString());
      //if(this.currentDelivery.accepted == true && this.currentDelivery.delivered == false)
     // {
        this.orderService.getSecondsUntilDelivery(this.currentDelivery.id).subscribe(
          data=>{
            this.seconds = data;
            if(this.seconds < 0)
            {
              return;
            }
            this.seconds = 70;
            console.log("sekunde: " + this.seconds);

            this.timeLeftMinutes = Math.trunc(this.seconds / 60);
            let decimals = (this.seconds / 60) - this.timeLeftMinutes;
            let carry = 0;
            if(decimals != 0){
              carry = 1 % decimals;
            }
            
            this.timeLeftSeconds = Math.round(60 * carry);
            this.timeLeftHours = Math.trunc(this.timeLeftMinutes / 60);

            let timer = Timer.Instance(this, this.timeLeftHours, this.timeLeftMinutes, this.timeLeftSeconds);

          },
          error=>{
            console.log(error);
          }
        );
        
        
     // }
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
        if(food == "")
          food = cnt + ". " + foodElement.name + " (" + foodElement.quantity + foodElement.unitOfMeasure + ") x" + foodElement.amount + " \n\tDodaci: " + ingredients;
        else
          food += ("\n " + cnt + ". " + foodElement.name + " (" + foodElement.quantity + foodElement.unitOfMeasure + ") x" + foodElement.amount + " \n\tDodaci: " + ingredients);
        ++cnt;
      });

      this.orderTableModel = { id: this.currentDelivery.id, food: food, timeDelivered: tD, timePosted: tP, timeAccepted:tA, price: this.currentDelivery.price, address: this.currentDelivery.address, comment: this.currentDelivery.comment, delivered: this.currentDelivery.delivered };
        

      console.log("trnutacna dostava:");
      console.log(this.orderTableModel);
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

  private constructor(public orders: CurrentDeliveryComponent, public hours: number, public minutes: number, public seconds: number) {
    this.doTimer();
  }
  public static Instance(orders: CurrentDeliveryComponent, hours: number, minutes: number, seconds: number) {
    if(this._instance == null)
    {
      this._instance = new Timer(orders, hours, minutes, seconds);
    }
    return this._instance;
  }
  async doTimer() {
    if(this.hours == 0 && this.minutes == 0 && this.seconds == 0){
      this.orders.delivered = true;
      return;
    }
    while(this.hours != 0 || this.minutes != 0 || this.seconds != 0)
    {
      await delay(1000);
      this.seconds = this.seconds - 1;
      if(this.seconds == -1)
      {
        this.minutes -= 1;
        this.seconds = 59;
      }
      if(this.minutes == -1)
      {
        this.hours -=1;
        this.minutes = 59;
      }
      this.orders.timeLeftHours = this.hours;
      this.orders.timeLeftMinutes = this.minutes;
      this.orders.timeLeftSeconds = this.seconds;
    }
    
    this.orders.delivered = true;
    /*this.orders.orderService.finishDelivery(this.orders.currentDelivery).subscribe(
      data=>{
        console.log("done");
        this.orders.delivered = true;
      },
      error=>{
        console.log(error);
      }
    );*/

  }
}
