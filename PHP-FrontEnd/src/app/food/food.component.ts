import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FoodService } from '../food.service';
import { Food } from '../foods/foods.component';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.css']
})
export class FoodComponent implements OnInit {

  food!:Food;

  imageUrl!:string;

  constructor(private route:ActivatedRoute, private foodService:FoodService, private router:Router) {
    this.food = new Food("", "", "", "",[]);
   }

  ngOnInit(): void {
    const foodId = this.route.snapshot.params["foodId"];
    this.foodService.getFood(foodId).subscribe(food => {
      this.food = food;
      this.imageUrl = environment.API_BASE_URL+"/"+food.imageUrl;
    });
  }

  /**
   * Delete the food on clicking the delete button
   * We need a food Id for that
   */
  delete():void{
    this.foodService.deleteFood(this.food._id).subscribe({
      next:food =>{
        if(food == null){
          alert("Deleted");
          this.router.navigate(['/foods']);
        }
      },
      error:err =>{
        alert("Something went wrong");
      }
    });
  }
}
