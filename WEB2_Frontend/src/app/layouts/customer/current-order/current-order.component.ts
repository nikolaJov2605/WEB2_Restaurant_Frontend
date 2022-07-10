import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Component, OnInit, enableProdMode } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FoodModel } from 'src/app/shared/models/food.model';
import { OrderModel } from 'src/app/shared/models/order.model';
import { OrderTableModel } from 'src/app/shared/models/orderTable.model';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-current-orders',
  templateUrl: './current-order.component.html',
  styleUrls: ['./current-order.component.scss']
})
export class CurrentOrderComponent implements OnInit {

  currentOrder: OrderModel = new OrderModel;
  orderTableModel: OrderTableModel = new OrderTableModel;

  public timeWriter: string = "";

  seconds: number = 0;

  public delivered: boolean = false;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    let email = localStorage.getItem('email');
    if (email != null) {
      this.orderService.getUndeliveredOrder(email).subscribe(
        (data: OrderModel) => {
          this.currentOrder = data;
          this.loadData();
        },
        error => {
          console.log(error);
        }
      );
    }
  }




  loadData(): void {
    let tA = "";
    if (this.currentOrder.timeAccepted != null)
      tA = parseDateToString(this.currentOrder.timeAccepted.toString());
    let tD = "";
    if (this.currentOrder.timeDelivered != null)
      tD = parseDateToString(this.currentOrder.timeDelivered.toString());
    let tP = parseDateToString(this.currentOrder.timePosted.toString());
    if (this.currentOrder.accepted == true) {
      this.orderService.getSecondsUntilDelivery(this.currentOrder.id).subscribe(
        data => {
          this.seconds = data;
          if (this.seconds < 0) {
            return;
          }

          console.log("sekunde: " + this.seconds);

          let timer = Timer.Instance(this, this.seconds);

        },
        error => {
          console.log(error);
        }
      );


    }
    let food = "";
    let cnt = 1;

    this.currentOrder.orderedFood.forEach(foodElement => {
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
      id: this.currentOrder.id, food: food, timeDelivered: tD, timePosted: tP, timeAccepted: tA,
      price: this.currentOrder.price, address: this.currentOrder.address, comment: this.currentOrder.comment, delivered: this.currentOrder.delivered,
      customer: this.currentOrder.userEmail, deliverer: this.currentOrder.delivererEmail, status: ""
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

  private constructor(public order: CurrentOrderComponent, public seconds: number) {
    this.doTimer();
  }
  public static Instance(order: CurrentOrderComponent, seconds: number) {
    if (this._instance == null) {
      this._instance = new Timer(order, seconds);
    }
    return this._instance;
  }
  async doTimer() {
    while (this.seconds >= 0) {
      //console.log(this.seconds);
      await delay(1000);
      this.order.timeWriter = this.order.secondsToHms(this.seconds);
      console.log(this.order.timeWriter);
      this.seconds = this.seconds - 1;
    }

    this.order.delivered = true;

  }
}
