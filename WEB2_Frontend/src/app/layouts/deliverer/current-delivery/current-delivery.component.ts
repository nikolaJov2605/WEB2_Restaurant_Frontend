import { OrderModel } from './../../../shared/models/order.model';
import { HomeDelivererComponent } from './../home-deliverer/home-deliverer.component';
import { HomeComponent } from './../../customer/home/home.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-current-delivery',
  templateUrl: './current-delivery.component.html',
  styleUrls: ['./current-delivery.component.scss']
})
export class CurrentDeliveryComponent implements OnInit {

  currentDelivery: OrderModel = new OrderModel;

  constructor(private homeDelivererComponent: HomeDelivererComponent) { }

  ngOnInit(): void {
    this.currentDelivery = this.homeDelivererComponent.takenOrder;
    console.log("Trenutna dostava:");
    console.log(this.currentDelivery);
  }

}
