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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddEditComponent } from './add-edit/add-edit.component';
import { GoBackComponent } from './go-back/go-back.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FoodComponent,
    FoodsComponent,
    FooterComponent,
    NavComponent,
    AddEditComponent,
    GoBackComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path:"",
        component:HomeComponent,
      },{
        path:"login",
        component:LoginComponent
      },{
        path:"register",
        component:RegisterComponent
      },{
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
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
