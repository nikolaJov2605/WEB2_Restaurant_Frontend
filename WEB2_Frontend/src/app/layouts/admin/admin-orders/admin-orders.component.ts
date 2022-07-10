import { MatDatepickerModule } from '@angular/material/datepicker';
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
  displayedOrderColumnsList: string[] = ['id', 'food', 'customer', 'deliverer', 'timePosted', 'timeDelivered', 'price', 'status'];

  dateNow: Date = new Date;

  public delivered: boolean = false;
  public accepted: boolean = false;
  public status: string = "";


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
    let nowFormated = this.dateNow.toISOString();
    let dateNowParsed = Date.parse(nowFormated);
    this.allOrders.forEach(element => {
      let dateDelivered = 0;
      if(element.timeDelivered != null)
      {
        dateDelivered = Date.parse(element.timeDelivered.toString());
        if(dateDelivered <= dateNowParsed)
        {
          this.delivered = true;
          this.status = "DOSTAVLjENO";
        }
        else
        {
          this.accepted = true;
          this.status = "PRIHVAĆENO";
        }
      }
      else
      {
        this.delivered = false;
        this.status = "NA ČEKANjU";
      }
      
      let tA = "";
      if(element.timeAccepted != null)
        tA = parseDateToString(element.timeAccepted.toString());
      let tD = "";
      if(element.timeDelivered != null)
        tD = parseDateToString(element.timeDelivered.toString());
      let tP = parseDateToString(element.timePosted.toString());
      let food = "";
      let cnt = 1;
      let uom = "";
      
      
      element.orderedFood.forEach(foodElement => {
        let ingredients = "";
        foodElement.ingredients.forEach(ingredientElement => {
          if(ingredients == "")
            ingredients = ingredientElement.name;
          else
            ingredients += (", " + ingredientElement.name);
          
          if(foodElement.unitOfMeasure == "piece")
            uom = "kom";
          else
            uom = "g";
        });
        
        if(food == "")
          food = cnt + ". " + foodElement.name + " (" + foodElement.quantity + uom + ") x" + foodElement.amount + " \n\tDodaci: " + ingredients;
        else
          food += ("\n " + cnt + ". " + foodElement.name + " (" + foodElement.quantity + foodElement.unitOfMeasure + ") x" + foodElement.amount + " \n\tDodaci: " + ingredients);
        ++cnt;
      });

      this.orderTable.push({id: element.id, food: food, timeDelivered: tD, timePosted: tP, timeAccepted: tA, price: element.price, address: element.address, comment: element.comment, delivered: element.delivered, customer: element.userEmail, deliverer: element.delivererEmail, status: this.status})
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
