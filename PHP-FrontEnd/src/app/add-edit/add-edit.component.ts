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

  foodAddFailed: boolean = false;

  isNotImage: boolean = false;
  isOverSizedImage: boolean = false;
  acceptableExtensions: string[] = ["image/png", "image/jpg", "image/jpeg"];

  constructor(private foodService: FoodService, private route: ActivatedRoute, private router: Router) {
    this.food = new Food("", "", "", "", [{ name: "", quantity: "" }]);
  }

  ngOnInit(): void {
    const foodId = this.route.snapshot.params['foodId'];
    if (foodId && Object.prototype.toString.call(foodId) === "[object String]") {
      this.required.thumbnail = false;
      this.getFood(foodId);
    }
  }
  setUpdate(): void {
    this.isUpdate = true;
  }
  getFood(foodId: string): void {
    this.foodService.getFood(foodId).subscribe({
      next: food => {
        this.food = food;
        this.foodImage = environment.API_BASE_URL+"/"+food.imageUrl;
        this.setUpdate();
      },
      error: err => {
        console.log("Couldn't get food.");
      }
    })
  }

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
            this.router.navigate(["foods/" + this.food._id]);
          } else {
            this.router.navigate(["foods/"]);
          }
        }
      },
      error: err => {
        this.foodAddFailed = true;
        this.makeErrorTrueForThreeSecond();
      }
    });
  }

  sizeAndExtensionValid(imageExtension: string, imageSize: number): boolean {
    if (!this.acceptableExtensions.includes(imageExtension)) {
      this.isNotImage = true;
    }
    if (imageSize > 5 * 1024 * 1024) {
      this.isOverSizedImage = true;
    }
    if (this.isNotImage || this.isOverSizedImage) {
      this.makeErrorTrueForThreeSecond();
      return false;
    }
    return true;
  }

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

  thumbnailNotAdded(): boolean {
    if(this.isUpdate){
      return false;
    }
    if (this.thumbnailImage == "") {
      this.required.thumbnail = true;
      this.makeErrorTrueForThreeSecond();
      return true;
    }
    return false;
  }

  foodInputFieldsNotFilled(): boolean {
    let isNotFilled: boolean = false;
    if (this.food.name == "") {
      this.required.name = true;
    } else if (this.food.origin == "") {
      this.required.origin = true;
    }

    if (this.required.name || this.required.origin) {
      isNotFilled = true;
      this.makeErrorTrueForThreeSecond();
    }
    return isNotFilled;
  }

  ingredientsInputNotFilled(): boolean {
    for (let i = 0; i < this.food.ingredients.length; i++) {
      if (this.food.ingredients[i].name == "" || this.food.ingredients[i].quantity == "") {
        this.required.ingredients = true;
        this.makeErrorTrueForThreeSecond();
        return true;
      }
    }
    return false;
  }

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

  makeErrorTrueForThreeSecond(): void {
    setTimeout(() => {
      this.required.name = false;
      this.required.origin = false;
      this.required.ingredients = false;
      this.isNotImage = false;
      this.isOverSizedImage = false;
      this.required.thumbnail = false;
      this.foodAddFailed = false;
    }, 3000);
  }


}
