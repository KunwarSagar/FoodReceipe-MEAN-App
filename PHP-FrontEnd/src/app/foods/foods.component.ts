import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

import { FoodService } from '../food.service';

export class Food {
  _id!: string;
  name!: string;
  origin!: string;
  ingredients!: [
    {
      name: string,
      // _id: string,
      quantity: string
    }
  ];
  description!: string;
  constructor(name: string, origin: string, description: string, ingredients: any) {
    this.name = name;
    this.origin = origin;
    this.description = description;
    this.ingredients = ingredients;
  }
}

@Component({
  selector: 'app-foods',
  templateUrl: './foods.component.html',
  styleUrls: ['./foods.component.css']
})
export class FoodsComponent implements OnInit {

  foods: Food[] = [];
  pageNumber: number = 1;
  totalPage!: number;
  isFirstPage!: boolean;
  isLastPage!: boolean;

  constructor(private foodService: FoodService, private route: ActivatedRoute, private router: Router) { }
  
  ngOnInit(): void {
    //we added inside subscribe just to recreate component,
    this.route.queryParams.subscribe(params =>{
      this.pageNumber = params['page'] ? parseInt(params['page'], environment.RADIX) : this.pageNumber;
      this.setPages();
      this.getFoods();
    })
    //we can also use following
    // this.router.routeReuseStrategy.shouldReuseRoute = function() {
    //     return false;
    // };
  }

  setPages(): void {
    this.foodService.getSize().subscribe({
      next: foods => {
        this.totalPage = Math.ceil(parseInt(foods.size) / environment.ITEMS_COUNT_PER_PAGE);    
        this.isFirstPage = this.pageNumber == 1 ? true: false;
        this.isLastPage = this.pageNumber == this.totalPage ? true: false; 
      }
    })
  }

  getFoods(): void {
    this.foodService.getAll(this.pageNumber).subscribe(foods => {
      // there is no items in page greater than 1
      if(foods.length == 0 && this.pageNumber > 1){
        this.pageNumber -= 1;
        this.router.navigate(['/foods'], {queryParams:{'page':this.pageNumber}});
      }else{
        this.foods = foods;
      }
    });
  }

  delete(foodId: string): void {
    this.foodService.deleteFood(foodId).subscribe({
      next: food => {
        if (food == null) {
          // this.router.navigate(['/foods']);
          this.ngOnInit();
        }
      },
      error: err => {
        alert("Something went wrong");
      }
    })
  }

  prev(): void {
    if (this.isFirstPage) {
      this.isLastPage = false;
      return;
    } else {
      this.pageNumber -= 1;
      this.router.navigate(['/foods'], {queryParams:{'page':this.pageNumber}});
    }
  }

  next(): void {
    if(this.isLastPage){
      this.isFirstPage = false;
      return;
    }else{
      this.pageNumber += 1;
      this.router.navigate(['/foods'], {queryParams:{'page':this.pageNumber}});
    }
  }
}
