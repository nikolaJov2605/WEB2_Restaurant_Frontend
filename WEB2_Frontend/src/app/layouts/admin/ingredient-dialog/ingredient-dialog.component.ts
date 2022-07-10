import { IngredientModel } from './../../../shared/models/ingredient.model';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FoodService } from 'src/app/shared/services/food.service';

@Component({
  selector: 'app-ingredient-dialog',
  templateUrl: './ingredient-dialog.component.html',
  styleUrls: ['./ingredient-dialog.component.scss']
})
export class IngredientDialogComponent implements OnInit {

  newIngredientForm = new UntypedFormGroup({
    Name: new UntypedFormControl("", [Validators.required]),
  });
  constructor(private foodService: FoodService, private router: Router, public dialogRef: MatDialogRef<IngredientDialogComponent>) { }

  ngOnInit(): void {
  }


  onSubmit(){
    let ingredientModel = new IngredientModel();
    ingredientModel.name = this.newIngredientForm.controls['Name'].value;


    this.foodService.addIngredient(ingredientModel).subscribe(
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
