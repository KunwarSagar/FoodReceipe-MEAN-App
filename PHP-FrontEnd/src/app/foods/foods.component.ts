import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

import { FoodService } from '../food.service';

export class Food {
  _id!: string;
  name!: string;
  origin!: string;
  imageUrl!: any;
  ingredients!: [
    {
      // _id: string,
      name: string,
      quantity: string
    }
  ];
  description!: string;

  constructor(name: string, origin: string, description: string, imageUrl: string, ingredients: any) {
    this.name = name;
    this.origin = origin;
    this.description = description;
    this.ingredients = ingredients;
    this.imageUrl = imageUrl;
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

  baseUrl: string = environment.API_BASE_URL;

  constructor(private foodService: FoodService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    /**
     * we added inside subscribe just to recreate component everytime pagination items are clicked so that it 
     * get new Foods or know the kind of page it is, like first or last or any other
     */
    this.route.queryParams.subscribe(params => {
      const queryParams = {
        searchString: params['searchString'] ? params['searchString'] : "",
        count: params['count'] ? parseInt(params['count']) : environment.ITEMS_COUNT_PER_PAGE,
        offset: params['offset'] ? parseInt(params['offset']) : environment.ITEMS_OFFSET,
        page: params['page'] ? parseInt(params['page'], environment.RADIX) : this.pageNumber
      }

      this.pageNumber = queryParams.page;
      this.setPages();

      if (queryParams.searchString != "" || queryParams.count > 0 || queryParams.offset > 0) {
        this.getFoods(queryParams);
      } else {
        this.getFoods();
      }
    });
  }

  /**
   * set page values like if the page is firstpage or lastpage
   */
  setPages(): void {
    this.foodService.getSize().subscribe({
      next: foods => {
        this.totalPage = Math.ceil(parseInt(foods.size) / environment.ITEMS_COUNT_PER_PAGE);
        this.isFirstPage = this.pageNumber == 1 ? true : false;
        this.isLastPage = this.pageNumber >= this.totalPage ? true : false;
      }
    })
  }

  /**
   * 
   * @param queryParams :any
   * Get all the foods from service based on the params
   */
  getFoods(queryParams:any = {searchString: "", count: 0, offset: 0, page:1}): void {
    this.foodService.getAll(queryParams).subscribe(foods => {
      // there is no items in page greater than 1
      if (foods.length == 0 && this.pageNumber > 1) {
        // this.pageNumber -= 1;
        console.log(this.foods);
        
        // this.router.navigate(['/foods'], { queryParams: { 'page': this.pageNumber } });
      } else {
        this.foods = foods;
      }
    });
  }

  /**
   * 
   * @param foodId :string
   * Delete food by id
   */
  delete(foodId: string): void {
    this.foodService.deleteFood(foodId).subscribe({
      next: food => {
        if (food == null) {
          this.ngOnInit();
        }
      },
      error: err => {
        alert("Something went wrong");
      }
    })
  }

  /**
   * 
   * @returns void
   * On clicking previous button of pagination go to previous page
   */
  prev(): void {
    if (this.isFirstPage) {
      this.isLastPage = false;
      return;
    } else {
      this.pageNumber -= 1;
      this.router.navigate(['/foods'], { queryParams: { 'page': this.pageNumber } });
    }
  }

  /**
   * 
   * @returns void
   * On clicking next button of pagination go to next page
   */
  next(): void {
    if (this.isLastPage) {
      this.isFirstPage = false;
      return;
    } else {
      this.pageNumber += 1;
      this.router.navigate(['/foods'], { queryParams: { 'page': this.pageNumber } });
    }
  }
}
