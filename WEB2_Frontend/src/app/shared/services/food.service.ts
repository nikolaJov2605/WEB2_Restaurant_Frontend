import { IngredientModel } from './../models/ingredient.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FoodModel } from '../models/food.model';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor( private http: HttpClient) { }

  retrieveAllFood() :Observable<FoodModel[]> {
    return this.http.get<FoodModel[]>(environment.serverURL + '/api/food/all');
  }

  getConcreteFood(id: number) : Observable<FoodModel> {
    return this.http.get<FoodModel>(environment.serverURL + `/api/food/${id}`);
  }

  retrieveAllIngredients() :Observable<IngredientModel[]> {
    return this.http.get<IngredientModel[]>(environment.serverURL + '/api/food/ingredients');
  }

}
