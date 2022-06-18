import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

import { FoodService } from '../food.service';
import { Food } from '../foods/foods.component';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css']
})
export class AddEditComponent implements OnInit {

  @ViewChild("addEditFoodForm")
  addEditFoodForm!: NgForm;

  food!: Food;
  isUpdate: boolean = false;
  foodImage:string = "";

  thumbnailImageBase64!: any;
  thumbnailImage: any = "";

  required: any = {
    name: false,
    origin: false,
    ingredients: false,
    thumbnail: false
  }

  isNotImage: boolean = false;
  isOverSizedImage: boolean = false;
  acceptableExtensions: string[] = ["image/png", "image/jpg", "image/jpeg"];

  hasAlert: boolean = false;
  alert_type!: string;
  alert_message!: string;

  constructor(private foodService: FoodService, private route: ActivatedRoute, private router: Router, private authService:AuthService) {
    this.food = new Food("", "", "", "", [{ name: "", quantity: "" }]);
  }

  ngOnInit(): void {
    if(!this.authService.isLoggedIn()){
      this.goToLogin()
    }else{
      const foodId = this.route.snapshot.params['foodId'];
      if (foodId && Object.prototype.toString.call(foodId) === "[object String]") {
        this.required.thumbnail = false;
        this.getFood(foodId);
      }
    }
  }

  /**
   * redirect to login
   */
  goToLogin() {
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/login']));
  }

  /**
   * set update
   */
  setUpdate(): void {
    this.isUpdate = true;
  }
  
  /**
   * get food by id
   * @param foodId 
   */
  getFood(foodId: string): void {
    this.foodService.getFood(foodId).subscribe({
      next: food => {
        this.food = food;
        this.foodImage = environment.API_BASE_URL+"/"+food.imageUrl;
        this.setUpdate();
      },
      error: err => {
        this.router.navigate(['/not-found']);
      }
    })
  }

  /**
   * On submit add/edit form
   * @returns 
   */
  addEditFood(): void {
    if (this.foodInputFieldsNotFilled() || this.ingredientsInputNotFilled() || this.thumbnailNotAdded()) {
      return;
    }

    let formData: FormData = new FormData();
    if(this.thumbnailImage == "" && this.isUpdate){
      formData.append('imageUrl', this.food.imageUrl);
    }else{
      formData.append('thumbnailImage', this.thumbnailImage);
    }
    formData.append('name', this.food.name);
    formData.append('description', this.food.description);
    formData.append('origin', this.food.origin);
    formData.append('ingredients', JSON.stringify(this.food.ingredients));

    this.isUpdate ? formData.append('_id', this.food._id) : "";
    this.foodService.addUpdateFood(formData, this.isUpdate).subscribe({
      next: food => {
        if (food) {
          if (this.isUpdate) {
            localStorage.setItem('u', 'true');
            this.router.navigate(["foods/" + this.food._id], {queryParams:{u:true}});
          } else {
            localStorage.setItem('a', 'true');
            this.router.navigate(["foods/"],{queryParams:{a:true}});
          }
        }
      },
      error: err => {
        this.hasAlert = true;
        this.alert_type = environment.ERROR_ALERT_TYPE;
        this.alert_message = this.isUpdate ? environment.UPDATE_FAIL : environment.ADD_FAIL;
        this.hideAlertAfterSomeTime();
      }
    });
  }

  /**
   * check image size and extension
   * @param imageExtension 
   * @param imageSize 
   * @returns 
   */
  sizeAndExtensionValid(imageExtension: string, imageSize: number): boolean {
    if (!this.acceptableExtensions.includes(imageExtension)) {
      this.isNotImage = true;
    }
    if (imageSize > 5 * 1024 * 1024) {
      this.isOverSizedImage = true;
    }
    if (this.isNotImage || this.isOverSizedImage) {
      this.hideAlertAfterSomeTime();
      return false;
    }
    return true;
  }

  /**
   * select thumbnail image
   * @param event 
   * @returns 
   */
  selectImage(event: any): void {
    const target: any = event.target;
    if (target.files && target.files[0]) {
      const reader: FileReader = new FileReader();
      const imageFile: File = target.files[0];
      const imageExtension: string = imageFile.type;
      const imageSize: number = imageFile.size;

      if (!this.sizeAndExtensionValid(imageExtension, imageSize)) {
        return;
      }

      this.thumbnailImage = imageFile;

      reader.onload = (e) => {
        this.thumbnailImageBase64 = e.target?.result;
      }
      reader.readAsDataURL(imageFile);
    }
  }

  /**
   * check thumbnail selected or not
   * @returns boolean
   */
  thumbnailNotAdded(): boolean {
    if(this.isUpdate){
      return false;
    }
    if (this.thumbnailImage == "") {
      this.required.thumbnail = true;
      this.hideAlertAfterSomeTime();
      return true;
    }
    return false;
  }

  /**
   * food input field not filleds
   * @returns boolean
   */
  foodInputFieldsNotFilled(): boolean {
    let isNotFilled: boolean = false;
    if (this.food.name == "") {
      this.required.name = true;
    } else if (this.food.origin == "") {
      this.required.origin = true;
    }

    if (this.required.name || this.required.origin) {
      isNotFilled = true;
      this.hideAlertAfterSomeTime();
    }
    return isNotFilled;
  }

  /**
   * ingredients input field empty chech
   * @returns boolean
   */
  ingredientsInputNotFilled(): boolean {
    for (let i = 0; i < this.food.ingredients.length; i++) {
      if (this.food.ingredients[i].name == "" || this.food.ingredients[i].quantity == "") {
        this.required.ingredients = true;
        this.hideAlertAfterSomeTime();
        return true;
      }
    }
    return false;
  }

  /**
   * add ingredient input field on click
   * @returns 
   */
  addIngredientInputField(): void {
    if (this.ingredientsInputNotFilled()) {
      return;
    }
    this.food.ingredients.push({ name: "", quantity: "" });
  }

  deleteInputField(index: number): void {
    for (let i = 0; i < this.food.ingredients.length; i++) {
      if (index > -1) {
        this.food.ingredients.splice(index, 1);

      }
    }
  }

  /**
   * hide alert after certain time
   */
   hideAlertAfterSomeTime(): void {
    setTimeout(() => {
      this.required.name = false;
      this.required.origin = false;
      this.required.ingredients = false;
      this.isNotImage = false;
      this.isOverSizedImage = false;
      this.required.thumbnail = false;

      this.hasAlert = false;
    }, environment.ALERT_HIDE_TIME_IN_SECOND);
  }
}
