import { FoodModel } from 'src/app/shared/models/food.model';

export class OrderModel{
    id: number = 0;
    userEmail: string = "";
    comment: string = "";
    address: string = "";
    accepted: boolean = false;
    orderedFood: Array<FoodModel> = [];
}

