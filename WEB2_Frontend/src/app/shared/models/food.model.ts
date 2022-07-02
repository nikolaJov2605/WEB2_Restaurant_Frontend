import { IngredientModel } from './ingredient.model';
export class FoodModel{
    id: number = 0;
    name: string = "";
    quantity: number = 0;
    unitOfMeasure: string = "";
    amount: number = 0;
    price: number = 0;
    ingredients: IngredientModel[] = [];
}