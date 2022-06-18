import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FoodService } from '../food.service';
import { Food } from '../foods/foods.component';
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.css']
})
export class FoodComponent implements OnInit {

  // fontawesome
  faTrash = faTrash;
  isLoggedIn!: boolean;

  food!: Food;

  imageUrl!: string;
  
  hasAlert: boolean = false;
  alert_type!: string;
  alert_message!: string;

  constructor(private route: ActivatedRoute, private foodService: FoodService, private router: Router, private authService: AuthService) {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.food = new Food("", "", "", "", []);
  }

  ngOnInit(): void {
    const foodId = this.route.snapshot.params["foodId"];
    this.route.queryParams.subscribe(params => {

      //update success alert
      if (params['u'] == "true") {
        if (localStorage.getItem('u') == "true") {
          localStorage.removeItem('u');
          this.showAlert(environment.SUCCESS_ALERT_TYPE, environment.UPDATE_SUCCESS);
        }
      }
    });

    // get food by id 
    this.foodService.getFood(foodId).subscribe({
      next: food => {
        if (food) {
          this.food = food;
          this.imageUrl = environment.API_BASE_URL + "/" + food.imageUrl;
        } else {
          this.router.navigate(['/not-found']);
        }
      },
      error: err => {
        this.router.navigate(['/not-found']);
      }
    });
  }

  /**
   * Delete the food on clicking the delete button
   * We need a food Id for that
   */
  delete(): void {
    this.foodService.deleteFood(this.food._id).subscribe({
      next: food => {
        if (food == null) {
          localStorage.setItem('d', 'true');
          this.router.navigate(['/foods'], {queryParams:{d:true}});
        }
      },
      error: err => {
        this.showAlert(environment.ERROR_ALERT_TYPE, environment.DELETE_FAILED);
      }
    });
  }

    /**
   * show alerts
   * @param alert_type 
   * @param message 
   */
     showAlert(alert_type:string, message:string): void {
      this.hasAlert = true;
      this.alert_type = alert_type;
      this.alert_message = message;
      this.hideAlertAfterSomeTime();
    }

    /**
   * hide alert after certain time
   */
     hideAlertAfterSomeTime(): void {
      setTimeout(() => {
        this.hasAlert = false;
      }, environment.ALERT_HIDE_TIME_IN_SECOND);
    }
}
