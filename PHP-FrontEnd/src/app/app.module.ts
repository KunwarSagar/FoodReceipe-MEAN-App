import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FoodComponent } from './food/food.component';
import { RouterModule } from '@angular/router';
import { FoodsComponent } from './foods/foods.component';
import { FooterComponent } from './footer/footer.component';
import { NavComponent } from './nav/nav.component';
import { FormsModule } from '@angular/forms';
import { AddEditComponent } from './add-edit/add-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FoodComponent,
    FoodsComponent,
    FooterComponent,
    NavComponent,
    AddEditComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path:"",
        component:HomeComponent,
      },
      {
        path:"foods",
        component:FoodsComponent
      },{
        path:"foods/add",
        component:AddEditComponent
      },{
        path:"foods/:foodId",
        component:FoodComponent
      },{
        path:"foods/:foodId/edit",
        component:AddEditComponent
      }
    ]),
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
