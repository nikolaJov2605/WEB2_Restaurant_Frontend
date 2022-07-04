import { OrderService } from '../../shared/services/order.service';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { FoodTableModel } from '../../shared/models/foodTable.model';
import { IngredientModel } from '../../shared/models/ingredient.model';
import { FoodService } from '../../shared/services/food.service';
import { Component, OnInit } from '@angular/core';
import { FoodModel } from 'src/app/shared/models/food.model';
import { MatTableDataSource } from '@angular/material/table';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { OrderModel } from 'src/app/shared/models/order.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  ngOnInit(): void {
  }


}