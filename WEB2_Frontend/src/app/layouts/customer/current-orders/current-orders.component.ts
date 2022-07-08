import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FoodModel } from 'src/app/shared/models/food.model';
import { OrderModel } from 'src/app/shared/models/order.model';
import { OrderTableModel } from 'src/app/shared/models/orderTable.model';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-current-orders',
  templateUrl: './current-orders.component.html',
  styleUrls: ['./current-orders.component.scss']
})
export class CurrentOrdersComponent implements OnInit {

  allOrders: OrderModel[] = [];
  orderTableModel: OrderTableModel = new OrderTableModel;
  orderTable: OrderTableModel[] = [];

  orderDataSource = new MatTableDataSource();
  displayedOrderColumnsList: string[] = ['id', 'food', 'timePosted', 'timeDelivered', 'price'];

  foodArray: FoodModel[] = [];
  foodModel: FoodModel = new FoodModel;

  timeDeliveredYears: number = 0;
  timeDeliveredMonths: number = 0;
  timeDeliveredDays: number = 0;
  timeDeliveredHours: number = 0;
  timeDeliveredMinutes: number = 0;
  timeDeliveredSeconds: number = 0;

  
  timeAcceptedYears: number = 0;
  timeAcceptedMonths: number = 0;
  timeAcceptedDays: number = 0;
  timeAcceptedHours: number = 0;
  timeAcceptedMinutes: number = 0;
  timeAcceptedSeconds: number = 0;

  public timeLeftHours: number = 0;
  public timeLeftMinutes: number = 0;
  public timeLeftSeconds: number = 0;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    let email = localStorage.getItem('email');
    if (email != null) {
      this.orderService.getUndeliveredOrders(email).subscribe(
        (data: OrderModel[]) => {
          this.allOrders = data;
          console.log("narudzbine:");
          console.log(data);
          this.loadData();
        },
        error => {
          alert('Došlo je do greške, molimo pokušajte kasnije.');
          console.log(error);
        }
      );
    }
  }


  loadData(): void {
    this.allOrders.forEach(element => {
      let tA = "";
      if(element.timeAccepted != null)
        tA = parseDateToString(element.timeAccepted.toString());
      let tD = "";
      if(element.timeDelivered != null)
        tD = parseDateToString(element.timeDelivered.toString());
      let tP = parseDateToString(element.timePosted.toString());
      if(element.accepted == true && element.delivered == false)
      {
        var array = new Array;
        var arrayDate = new Array;
        var arrayTime = new Array;
        array = tD.split(', ');
        console.log("tD:" + tD);
        arrayDate = array[0].split('.');
        arrayTime = array[1].substring(0, array[1].length - 1).split(':');

        this.timeDeliveredDays = parseInt(arrayDate[0]);
        this.timeDeliveredMonths = parseInt(arrayDate[1]);
        this.timeDeliveredYears = parseInt(arrayDate[2]);
        this.timeDeliveredHours = parseInt(arrayTime[0]);
        this.timeDeliveredMinutes = parseInt(arrayTime[1]);
        this.timeDeliveredSeconds = 0;
        var dateDelivered = new Date(this.timeDeliveredYears, this.timeDeliveredMonths, this.timeDeliveredDays, this.timeDeliveredHours, this.timeDeliveredMinutes, this.timeAcceptedSeconds);
        
        /*array = tA.split(', ');
        console.log("tA:" + tA);
        arrayDate = array[0].split('.');
        arrayTime = array[1].substring(0, array[1].length - 1).split(':');

        this.timeAcceptedDays = parseInt(arrayDate[0]);
        this.timeAcceptedMonths = parseInt(arrayDate[1]);
        this.timeAcceptedYears = parseInt(arrayDate[2]);
        this.timeAcceptedHours = parseInt(arrayTime[0]);
        this.timeAcceptedMinutes = parseInt(arrayTime[1]);
        this.timeAcceptedSeconds = 0;
        var dateAccepted = new Date(this.timeAcceptedYears, this.timeAcceptedMonths, this.timeAcceptedDays, this.timeAcceptedHours, this.timeAcceptedMinutes, this.timeAcceptedSeconds);
        
        var dif = dateDelivered.getTime() - dateAccepted.getTime();
        var seconds = dif / 1000;*/
        
        
        var dateNow = new Date();

        var dif = dateDelivered.getTime() - dateNow.getTime();
        var seconds = dif / 1000;

        
        this.timeLeftMinutes = Math.trunc(seconds / 60);
        let decimals = (seconds / 60) - this.timeLeftMinutes;
        let carry = 0;
        if(decimals != 0){
          carry = 1 % decimals;
        }
        
        this.timeLeftSeconds = Math.round(60 * carry);
        this.timeLeftHours = Math.trunc(this.timeLeftMinutes / 60);

        var timer = Timer.Instance(this, this.timeLeftHours, this.timeLeftMinutes, this.timeLeftSeconds);
      }
      let food = "";
      let cnt = 1;

      element.orderedFood.forEach(foodElement => {
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



        this.orderTable.push({ id: element.id, food: food, timeDelivered: tD, timePosted: tP, timeAccepted:tA, price: element.price })
        this.orderDataSource.data = this.orderTable;
        console.log(this.orderTable);
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
  public timeLeftHours: number = 0;
  public timeLeftMinutes: number = 0;
  public timeLeftSeconds: number = 0;

  private constructor(public orders: CurrentOrdersComponent, public hours: number, public minutes: number, public seconds: number) {
    this.doTimer();
  }
  public static Instance(orders: CurrentOrdersComponent, hours: number, minutes: number, seconds: number) {
    if(this._instance == null)
    {
      this._instance = new Timer(orders, hours, minutes, seconds);
    }
    return this._instance;
  }
  async doTimer() {
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
    
    

  }
}
