import { IngredientDialogComponent } from './../ingredient-dialog/ingredient-dialog.component';
import { FoodDialogComponent } from './../food-dialog/food-dialog.component';
import { identifierName } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogActions } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FoodModel } from 'src/app/shared/models/food.model';
import { FoodAdminTableModel } from 'src/app/shared/models/foodAdminTable.model';
import { IngredientModel } from 'src/app/shared/models/ingredient.model';
import { FoodService } from 'src/app/shared/services/food.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.scss']
})
export class FoodComponent implements OnInit {

  allFood: FoodModel[] = [];

  foodTableModel: FoodAdminTableModel = new FoodAdminTableModel;
  foodTable: FoodAdminTableModel[] = [];

  foodDataSource = new MatTableDataSource();
  displayedFoodColumnsList: string[] = ['id', 'name', 'quantity', 'unitOfMeasure', 'price'];

  
  allIngredients: IngredientModel[] = [];
  ingredientModel : IngredientModel = new IngredientModel;

  ingredientDataSource = new MatTableDataSource();
  displayedIngredientColumnList: string[] = ['id', 'name'];

  constructor(private foodService: FoodService, private dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.foodDataSource.data = this.foodTable;
    this.ingredientDataSource.data = this.allIngredients;
    this.foodService.retrieveAllFood().subscribe(
      (data: FoodModel[]) => {
        this.allFood = data;
        //console.log(data);
        
        this.allFood.forEach(element => {
          let uom = "";
    
          if(element.unitOfMeasure == "piece")
            uom = "kom";
          else
            uom = "g";
    
          this.foodTable.push({ id: element.id, name: element.name, quantity: element.quantity, unitOfMeasure: uom, price: element.price });
          this.foodDataSource.data = this.foodTable;
        });
      },
      error => {
        alert('Došlo je do greške, molimo pokušajte kasnije.');
        console.log(error);
      }
    );

    this.foodService.retrieveAllIngredients().subscribe(
      (data: IngredientModel[]) => {
        this.allIngredients = data;
        //console.log(data);
        this.ingredientDataSource.data = this.allIngredients;

        //console.log("tabela:")
        //console.log(this.allIngredients);

      },
      error => {
        alert('Došlo je do greške, molimo pokušajte kasnije.');
        console.log(error);
      }
    );

  }

  openFoodDialog(event : any){
    event.stopPropagation();

    let dialogRef = this.dialog.open(FoodDialogComponent, {
      height: '420px',
      width: '550px'
    });

    dialogRef.afterClosed().subscribe(
      data=>{
        this.foodService.retrieveAllFood().subscribe(
          (data: FoodModel[]) => {
            this.allFood = data;
            //console.log(data);
            
            this.allFood.forEach(element => {
              let uom = "";
        
              if(element.unitOfMeasure == "piece")
                uom = "kom";
              else
                uom = "g";
        
              this.foodTable.push({ id: element.id, name: element.name, quantity: element.quantity, unitOfMeasure: uom, price: element.price });
              this.foodDataSource.data = this.foodTable;
            });
          },
          error => {
            alert('Došlo je do greške, molimo pokušajte kasnije.');
            console.log(error);
          }
        );
      }
    );
  }

  openIngredientDialog(event : any){
    event.stopPropagation();

    let dialogRef = this.dialog.open(IngredientDialogComponent, {
      height: '270px',
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(
      data=>{
        this.foodService.retrieveAllIngredients().subscribe(
          (data: IngredientModel[]) => {
            this.allIngredients = data;
            //console.log(data);
            this.ingredientDataSource.data = this.allIngredients;
    
            //console.log("tabela:")
            //console.log(this.allIngredients);
    
          },
          error => {
            alert('Došlo je do greške, molimo pokušajte kasnije.');
            console.log(error);
          }
        );
      }
    );
  }

}

