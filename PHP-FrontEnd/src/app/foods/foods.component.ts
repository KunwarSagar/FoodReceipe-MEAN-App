import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { FoodService } from '../food.service';
import { AuthService } from '../auth.service';

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

  // fontawesonme icons
  faTrash = faTrash;

  isLoggedIn!:boolean;

  foods: Food[] = [];
  pageNumber: number = 1;
  totalPage!: number;
  isFirstPage!: boolean;
  isLastPage!: boolean;

  baseUrl: string = environment.API_BASE_URL;
  queryParams: any = {
    searchString: "",
    count: environment.ITEMS_COUNT_PER_PAGE,
    offset: environment.ITEMS_OFFSET,
    page: 1
  }
  constructor(private foodService: FoodService, private route: ActivatedRoute, private router: Router, private authService:AuthService) {
    this.isLoggedIn = this.authService.isLoggedIn();
   }


  ngOnInit(): void {
    /**
     * we added inside subscribe just to recreate component everytime pagination items are clicked so that it 
     * get new Foods or know the kind of page it is, like first or last or any other
     */
    this.route.queryParams.subscribe(params => {
      this.queryParams = {
        searchString: params['searchString'] ? params['searchString'] : "",
        count: params['count'] ? parseInt(params['count'], environment.RADIX) : this.queryParams.count,
        offset: params['offset'] ? parseInt(params['offset'], environment.RADIX) : this.queryParams.offset,
        page: params['page'] ? parseInt(params['page'], environment.RADIX) : this.pageNumber
      }

      this.setPages(this.queryParams);

      if (this.queryParams.searchString != "" || this.queryParams.count > 0 || this.queryParams.offset > 0) {
        this.getFoods(this.queryParams);
      } else {
        this.getFoods();
      }
    });
  }

  /**
   * set page values like if the page is firstpage or lastpage
   */
  setPages(queryParams: any = { searchString: "", count: 0, offset: 0, page: 1 }): void {
    this.pageNumber = queryParams.page;

    this.foodService.getSize().subscribe({
      next: foods => {
        this.totalPage = Math.ceil(parseInt(foods.size) / queryParams.count);
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
  getFoods(queryParams: any = { searchString: "", count: 0, offset: 0, page: 1 }): void {
    this.foodService.getAll(queryParams).subscribe(foods => {
      // there is no items in page greater than 1
      // if (foods.length == 0 && this.pageNumber > 1) {
      // this.router.navigate(['/foods'], { queryParams: { 'page': this.pageNumber } });
      // }
      this.foods = foods;

      // while searching if count is less than required per page, make this last page
      if(this.foods.length < environment.ITEMS_COUNT_PER_PAGE){
        this.isLastPage = true;
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
          this.redirectTo('/foods');
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
      this.queryParams.page = this.pageNumber;
      this.redirectTo('/foods');
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
      this.queryParams.page = this.pageNumber;
      this.redirectTo('/foods');
    }
  }

  /**
   * Redirect to provided uri
   * @param uri 
   */
  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri], { queryParams: this.queryParams }));
  }
}
