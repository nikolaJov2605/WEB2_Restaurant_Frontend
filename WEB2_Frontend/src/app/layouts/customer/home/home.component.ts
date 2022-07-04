import { OrderService } from './../../../shared/services/order.service';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { FoodTableModel } from 'src/app/shared/models/foodTable.model';
import { IngredientModel } from 'src/app/shared/models/ingredient.model';
import { FoodService } from 'src/app/shared/services/food.service';
import { Component, OnInit } from '@angular/core';
import { FoodModel } from 'src/app/shared/models/food.model';
import { MatTableDataSource } from '@angular/material/table';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { OrderModel } from 'src/app/shared/models/order.model';
import { Router } from '@angular/router';
import { CustomerModule } from '../customer.module';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  orderForm = new UntypedFormGroup({
    address : new UntypedFormControl("", [Validators.required]),
    comment : new UntypedFormControl("", Validators.required),
  });

  ingredientArray: string[] = [];
  concreteFood: FoodModel = new FoodModel;
  orderFood: FoodModel = new FoodModel;
  selectedFood: FoodModel[] = [];
  allFood: FoodModel[] = [];
  allIngrediens: IngredientModel[] = [];

  foodTableModel: FoodTableModel = new FoodTableModel;
  foodTable: FoodTableModel[] = [];

  dataFoodList = new MatTableDataSource();
  displayedFoodColumnsList: string[] = ['number', 'name', 'ingredients', 'amount', 'price', 'button'];

  ingredientCount: number = 0;
  ingredientsForFood: string = "";
  fullOrderPrice: number = 0;
  deliveryFee: number = 150;

  constructor(private foodService: FoodService, private orderService: OrderService, private router: Router) { }

  ngOnInit(): void {
    this.dataFoodList.data = this.foodTable;
    this.foodService.retrieveAllFood().subscribe(
      (data : FoodModel[]) => {
        this.allFood = data;
        console.log(data);
        this.foodService.retrieveAllIngredients().subscribe(
          (data : IngredientModel[]) => {
            this.allIngrediens = data;
            console.log('ingredients');
            console.log(data);
            this.ingredientCount = this.allFood.length * this.allIngrediens.length;
          },
          error => {
            alert('Došlo je do greške, molimo pokušajte kasnije.');
            console.log(error);
          }
        );
      },
      error => {
        alert('Došlo je do greške, molimo pokušajte kasnije.');
        console.log(error);
      }
    );
  }

  onAddToOrder(id: number){
    this.foodService.getConcreteFood(id).subscribe(
      (data : FoodModel)=>{
        this.concreteFood = data;
        //console.log(data);

        this.selectedFood.push(data);
        //console.log(this.selectedFood);

        let uom;
        if(data.unitOfMeasure == 'gram')
          uom = 'g';
        else
          uom = 'kom';
        let modelName = data.name + ', ' + data.quantity + '' + uom;
        let modelAmount = document.getElementById(data.id.toString()) as HTMLInputElement | null;
        let amountValue;
        if (modelAmount == null || typeof modelAmount == 'undefined') {
          return;
        }
        amountValue = parseFloat(modelAmount.value);
        if(isNaN(amountValue))
        {
          return;
        }
        //alert(modelAmount.value);
        //alert(amountValue);
        let modelNumber = this.foodTable.length + 1;
        let modelIngredients: string = "";
        let modelPrice = amountValue * data.price;
        this.ingredientArray.forEach(element => {
          let arr = element.split(" ");
          if(arr[arr.length - 1] === id.toString())
          {
            if(modelIngredients == "")
            {
              modelIngredients = arr[0];
              for(let i = 1; i < arr.length - 1; i++) {
                modelIngredients += ' ' + arr[i];
              }
            }
            else
            {
              modelIngredients += (", " + arr[0]);
              for(let i = 1; i < arr.length - 1; i++) {
                modelIngredients += ' ' + arr[i];
              }
            }
            //alert("usao");
            //console.log(this.foodTableModel.ingredients);
            //alert(this.foodTableModel.ingredients);
          }
        });
        //this.foodTableModel.ingredients = "";
        
        //alert(amountValue);
        //alert(id);
        this.foodTable.push({id: id, number: modelNumber, name: modelName, amount: amountValue, ingredients: modelIngredients, price: modelPrice});
        this.dataFoodList.data = this.foodTable;
        console.log(this.foodTable);
        
        let price = 0;
        this.foodTable.forEach(element => {
          price += element.price;
        });
        
        this.fullOrderPrice = price + this.deliveryFee;
      },
      error => {
        alert('Izabrana hrana nije dostupna.');
        console.log(error);
      }
    );
    this.foodTableModel.ingredients = "";

  }

  onCheckBoxChange(name: string, ob: MatCheckboxChange)
  {
    //alert(ob.source.id);
    const myArray = ob.source.id.split("-");
    let id = parseFloat(myArray[2]);
    let food = Math.ceil(((id - 1) / (this.ingredientCount - 1)) * this.allFood.length);
    if(food == 0)
      food = 1;
    //alert(food);
    for(let i = 0; i < this.allIngrediens.length; i++)
    {
      if(this.allIngrediens[i].name == name)
      {
        if (ob.checked && this, !this.ingredientArray.includes(name + ' ' + food)) {
          this.ingredientArray.push(name + ' ' + food);
          
        }
        else {
          const index = this.ingredientArray.indexOf(name + ' ' + food);
          if (index > -1) { // only splice array when item is found
            this.ingredientArray.splice(index, 1); // 2nd parameter means remove one item only
          }
        }

        //alert(this.ingredientArray);
        break;
        
      }
    }
  }

  deleteRow(food: FoodTableModel){
    const index = this.foodTable.indexOf(food);
    if (index > -1) { // only splice array when item is found
      this.foodTable.splice(index, 1); // 2nd parameter means remove one item only
    }
    let counter = 1;
    this.foodTable.forEach(element => {
      element.number = counter;
      counter++;
    });
    this.dataFoodList.data = this.foodTable;
    
    let price = 0;
    this.foodTable.forEach(element => {
      price += element.price;
    });
    
    this.fullOrderPrice = price + this.deliveryFee;
  }




  createOrder(){
    let order: OrderModel = new OrderModel();
    order.address = this.orderForm.controls['address'].value;
    order.comment = this.orderForm.controls['comment'].value;
    var email = localStorage.getItem('email');
    if(email != null)
      order.userEmail = email;
    order.accepted = false;


    this.foodTable.forEach(element => {
      let iden = element.id;
      //alert("id: " + iden);
      var array = element.name.split(" ");
      let foodName = "";
      if(array.length < 3)
      {
        foodName = array[0].substring(0, array[0].length - 1);
      }
      else
      {
        let counter = 1;
        foodName += array[0];
        for(let i = 1; i < array.length - 2; i++)
        {
          foodName += ' ' + array[i];
          counter++;
        }
        foodName += ' ' + array[array.length - 2].substring(0, array[counter].length - 1);
      }
      //alert(foodName);
      
      let quantity = "";
      let unitOfMeasureF = "";
      let amount = element.amount;

      if(array[array.length - 1][array[array.length - 1].length - 1] == 'g')
      {
        unitOfMeasureF = "gram";
        let temp = "";
        temp = array[array.length - 1];
        quantity = temp.substring(0, temp.length - 1);
      }
      else
      {
        unitOfMeasureF = "piece";
        let temp = "";
        temp = array[array.length - 1];
        quantity = temp.substring(0, temp.length - 3);
      }
      //alert(unitOfMeasureF);
      //alert(quantity);
      let quantityNum = parseFloat(quantity);
      let priceF = element.price / element.amount;

      this.orderFood.id = element.id;
      this.orderFood.name = foodName;
      this.orderFood.quantity = quantityNum;
      this.orderFood.price = priceF;
      this.orderFood.unitOfMeasure = unitOfMeasureF;

      var ingrArr = element.ingredients.split(", ");
      var ingredientsArray: IngredientModel[] = [];
      this.allIngrediens.forEach(ingr => {
        if(ingrArr.includes(ingr.name))
        {
          ingredientsArray.push(ingr);
        }
      });

      order.orderedFood.push({id: iden, name: foodName, quantity: quantityNum, price: priceF, unitOfMeasure: unitOfMeasureF, amount: amount, ingredients: ingredientsArray});
      console.log(order);
      this.orderFood.ingredients = ingredientsArray;

    });

    this.orderService.createOrder(order).subscribe(
      (data : boolean) => {
        window.location.reload();
        //this.router.navigateByUrl('home/customer');
        //alert(data);
      },
      error => {
        console.log(order);
          alert('Narudžbina neuspešna.');
      }
    );
  }

}
