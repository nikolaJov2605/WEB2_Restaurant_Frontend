import { FoodComponent } from './../food/food.component';
import { FoodService } from 'src/app/shared/services/food.service';
import { UserService } from './../../../shared/services/user.service';
import { FoodTableModel } from './../../../shared/models/foodTable.model';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { FoodAdminTableModel } from 'src/app/shared/models/foodAdminTable.model';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-food-dialog',
  templateUrl: './food-dialog.component.html',
  styleUrls: ['./food-dialog.component.scss']
})
export class FoodDialogComponent implements OnInit {

  newFoodForm = new UntypedFormGroup({
    Name: new UntypedFormControl("", [Validators.required]),
    Quantity: new UntypedFormControl("", Validators.required),
    UnitOfMeasure: new UntypedFormControl("", Validators.required),
    Price: new UntypedFormControl("", Validators.required)
  });
  constructor(private foodService: FoodService, private router: Router, public dialogRef: MatDialogRef<FoodDialogComponent>) { }

  ngOnInit(): void {
  }

  onSubmit(){
    let foodModel = new FoodAdminTableModel();
    foodModel.name = this.newFoodForm.controls['Name'].value;
    foodModel.quantity = this.newFoodForm.controls['Quantity'].value;

    if(this.newFoodForm.controls['UnitOfMeasure'].value == "komad"){
      foodModel.unitOfMeasure = "piece";
    }
    else{
      foodModel.unitOfMeasure = "gram";
    }
    //alert(parseInt(this.newFoodForm.controls['Quantity'].value));
    if(isNaN(parseInt(this.newFoodForm.controls['Quantity'].value))){
      alert("Unesite validnu količinu!");
      return;
    }
    else
      foodModel.quantity = this.newFoodForm.controls['Quantity'].value;


    if(isNaN(parseInt(this.newFoodForm.controls['Price'].value))){
      alert("Unesite validnu cenu!");
      return;
    }
    else
      foodModel.price = this.newFoodForm.controls['Price'].value;

  

    this.foodService.addFood(foodModel).subscribe(
      data=>{
        //alert(data);
        this.dialogRef.close();
        //this.router.navigateByUrl('layouts/admin/food');
      },
      error=>{
        console.log(error);
      }
    );

  }

}
