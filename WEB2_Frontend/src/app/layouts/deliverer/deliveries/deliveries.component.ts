import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AvailableOrderModel } from 'src/app/shared/models/availableOrder.model';
import { OrderModel } from 'src/app/shared/models/order.model';
import { OrderTakeModel } from 'src/app/shared/models/orderTake.model';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss']
})
export class DeliveriesComponent implements OnInit {

  deliveredOrders: OrderModel[] = [];
  deliveredOrdersTableModel: AvailableOrderModel = new AvailableOrderModel;
  deliveredOrdersTable: AvailableOrderModel[] = [];

  deliveredOrdersDataSource = new MatTableDataSource();
  displayedAvailableOrderDataSourceColumnsList: string[] = ['id', 'food', 'timePosted', 'address', 'comment', 'price'];

  orderTakeModel: OrderTakeModel = new OrderTakeModel;

  public takenOrder: OrderModel = new OrderModel;

  constructor(private orderService: OrderService, private router: Router) { }

  ngOnInit(): void {
    const e = localStorage.getItem("email");
    let email = "";
    if(e != null)
      email = e;
    this.orderService.getMyDeliveries(email).subscribe(
      data=>{
        console.log("moje narudzbine");
        console.log("data");
        this.deliveredOrders = data;
        this.loadTable();
      },
      error=>{
        console.log(error);
      }
    );
    /*this.orderService.getAvailableOrders().subscribe(
      (data : OrderModel[]) => {
        console.log("narudzbine:");
        console.log(data);
        this.availableOrders = data;
        this.loadTable();
      },
      error => {
        alert('Došlo je do greške, molimo pokušajte kasnije.');
        console.log(error);
      }
    );*/

  }



  loadTable(): void{
    this.deliveredOrders.forEach(element => {
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




      //if(element.delivered == true){
        this.deliveredOrdersTable.push({id: element.id, food: food, timePosted: tP, address: element.address, comment: element.comment, price: element.price})
        this.deliveredOrdersDataSource.data = this.deliveredOrdersTable;
        console.log("tabela:")
        console.log(this.deliveredOrdersTable);
      //}
    });
  }

  takeOrder(order: AvailableOrderModel){
    const e = localStorage.getItem('email');
    let email = "";
    if(e != null)
      email = e;
    this.orderTakeModel.delivererEmail = email;
    this.orderTakeModel.orderId = order.id;
    
    this.orderService.takeOrder(this.orderTakeModel).subscribe(
      (data: OrderModel)=>{
        console.log(data);
        this.takenOrder = data;
        this.router.navigate(['layouts/deliverer/current-delivery'])
      },
      error=>{
        alert("Došlo je do greške, molimo pokušajte ponovo kasnije!");
        console.log(error);
      }
    );
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
