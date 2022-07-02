import { OrderModel } from './../models/order.model';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { query } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})

export class OrderService{
    constructor( private http: HttpClient) { }
    
    createOrder(order:OrderModel): Observable<boolean> {
        return this.http.post<boolean>(environment.serverURL + '/api/orders/create-order', order);
    }

    /*getNewOrders() : Observable<Order[]>{
        return this.http.get<Order[]>(environment.serverURL + '/api/orders/newOrders');

    }
    
    getCurrentOrder(email:string) : Observable<Order>{
        let queryParams = new HttpParams().append("customerId", email);
        return this.http.get<Order>(environment.serverURL + '/api/orders/currentOrder', {params:queryParams});
    }

    getOrdersById(email:string) : Observable<Order[]>{
        let queryParams = new HttpParams().append("customerId", email);
        return this.http.get<Order[]>(environment.serverURL + '/api/orders/ordersId', {params:queryParams});

    }

    makeOrder(order:Order): Observable<boolean> {
        console.log("ayo");
        return this.http.post<boolean>(environment.serverURL + '/api/orders/makeOrder', order);
    }
    
    takeOrder(orderId:number, delivererId:number) : Observable<Order>{
        var inData = {'DelivererId' : delivererId, 'OrderId' : orderId};
        return this.http.post<Order>(environment.serverURL + '/api/orders/takeOrder', inData);
    }*/
    

}