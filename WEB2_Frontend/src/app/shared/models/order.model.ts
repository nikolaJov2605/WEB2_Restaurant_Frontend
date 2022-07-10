import { FoodModel } from 'src/app/shared/models/food.model';

export class OrderModel{
    id: number = 0;
    userEmail: string = "";
    comment: string = "";
    address: string = "";
    accepted: boolean = false;
    timePosted: Date = new Date;
    timeAccepted: Date = new Date;
    timeDelivered: Date = new Date;
    delivered: boolean = false;
    delivererEmail: string = "";
    price: number = 0;
    orderedFood: Array<FoodModel> = [];
}

