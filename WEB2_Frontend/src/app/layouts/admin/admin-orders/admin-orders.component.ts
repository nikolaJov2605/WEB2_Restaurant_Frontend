import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FoodModel } from 'src/app/shared/models/food.model';
import { OrderModel } from 'src/app/shared/models/order.model';
import { OrderTableModel } from 'src/app/shared/models/orderTable.model';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent implements OnInit {

  allOrders: OrderModel[] = [];
  orderTableModel: OrderTableModel = new OrderTableModel;
  orderTable: OrderTableModel[] = [];

  orderDataSource = new MatTableDataSource();
  displayedOrderColumnsList: string[] = ['id', 'food', 'timePosted', 'timeDelivered', 'price'];

  foodArray: FoodModel[] = [];
  foodModel: FoodModel = new FoodModel;


  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.orderService.getAllOrders().subscribe(
      (data : OrderModel[]) => {
        this.allOrders = data;
        console.log("narudzbine:");
        console.log(data);
        this.loadTable();
      },
      error => {
        alert('Došlo je do greške, molimo pokušajte kasnije.');
        console.log(error);
      }
    );
  }

  loadTable(): void{
    this.allOrders.forEach(element => {
      let tA = "";
      if(element.timeAccepted != null)
        tA = parseDateToString(element.timeAccepted.toString());
      let tD = "";
      if(element.timeDelivered != null)
        tD = parseDateToString(element.timeDelivered.toString());
      let tP = parseDateToString(element.timePosted.toString());
      let food = "";
      let cnt = 1;

      element.orderedFood.forEach(foodElement => {
        let ingredients = "";
        foodElement.ingredients.forEach(ingredientElement => {
          if(ingredients == "")
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




      if(element.delivered == true){
        this.orderTable.push({id: element.id, food: food, timeDelivered: tD, timePosted: tP, timeAccepted: tA, price: element.price, address: element.address, comment: element.comment, delivered: element.delivered})
        this.orderDataSource.data = this.orderTable;
        console.log(this.orderTable);
      }
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
