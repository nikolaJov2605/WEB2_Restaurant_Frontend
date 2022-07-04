import { OrderService } from './../../../shared/services/order.service';
import { Component, OnInit } from '@angular/core';
import { OrderModel } from 'src/app/shared/models/order.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  allOrders: OrderModel[] = [];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    let email = localStorage.getItem('email');
    alert(email);
    if(email != null){
      this.orderService.getAllMyOrders(email).subscribe(
        (data : OrderModel[]) => {
          this.allOrders = data;
          console.log(data);
          alert("gotovo");
        },
        error => {
          alert('Došlo je do greške, molimo pokušajte kasnije.');
          console.log(error);
          alert("propali smo");
        }
      );
    }
    
  }

}
