import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

import { FoodService } from '../food.service';
import { Food } from '../foods/foods.component';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css']
})
export class AddEditComponent implements OnInit {

  @ViewChild("addEditFoodForm")
  addEditFoodForm!:NgForm;
  
  food!:Food;
  isUpdate:boolean=false;

  required:any = {
    name : false,
    origin : false,
    ingredients : false
  }

  foodAddFailed:boolean = false;

  constructor(private foodService:FoodService, private route:ActivatedRoute, private router:Router) { 
    this.food = new Food("","","",[{name:"", quantity:""}]);
  }

  ngOnInit(): void {
    const foodId = this.route.snapshot.params['foodId'];
    if(foodId && Object.prototype.toString.call(foodId) === "[object String]"){
      this.getFood(foodId);
    }
  }

  makeInputErrorTrueForThreeSecond():void{
    setTimeout(()=>{
      this.required.name = false;
      this.required.origin = false;
      this.required.ingredients = false;
    }, 3000);
  }

  foodInputFieldsNotFilled():boolean{
    let isNotFilled = false;
    if(this.food.name == ""){
      this.required.name = true;
      isNotFilled = true;
      this.makeInputErrorTrueForThreeSecond();
    }
    if(this.food.origin == ""){
      this.required.origin = true;
      isNotFilled = true;
      this.makeInputErrorTrueForThreeSecond();
    }
    return isNotFilled;
  }

  ingredientsInputNotFilled():boolean{
    for(let i = 0; i< this.food.ingredients.length;i++){
      if(this.food.ingredients[i].name == "" || this.food.ingredients[i].quantity == ""){
        this.required.ingredients = true;
        this.makeInputErrorTrueForThreeSecond();
        return true;
      }
    }
    return false;
  }

  addIngredientInputField():void{    
    if(this.ingredientsInputNotFilled()){
      return;
    }
    this.food.ingredients.push({name:"",quantity:""});
  }

  deleteInputField(index:number):void{
    for(let i=0;i<this.food.ingredients.length;i++){
      if(index>-1){
        this.food.ingredients.splice(index,1);
        
      }
    }
  }

  setUpdate():void{
    this.isUpdate = true;
  }
  getFood(foodId:string):void{
    this.foodService.getFood(foodId).subscribe({
      next:food =>{
        this.food = food;
        this.setUpdate();
      },
      error:err =>{
        console.log("Couldn't get food.");
      }
    })
  }

  addEditFood():void{
    
    if(this.foodInputFieldsNotFilled() || this.ingredientsInputNotFilled()){
      return;
    }

    this.foodService.addUpdateFood(this.food, this.isUpdate).subscribe((food)=> {
      if(this.isUpdate){
        this.router.navigate(["foods/"+this.food._id]);
      }else{
        this.router.navigate(["foods/"]);
      }
    });
  }

}
