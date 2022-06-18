import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FoodComponent } from './food/food.component';
import { FoodsComponent } from './foods/foods.component';
import { FooterComponent } from './footer/footer.component';
import { NavComponent } from './nav/nav.component';
import { AddEditComponent } from './add-edit/add-edit.component';
import { GoBackComponent } from './go-back/go-back.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { environment } from 'src/environments/environment';
import { TokenService } from './token.service';
import { NotFoundErorComponent } from './not-found-eror/not-found-eror.component';
import { AlertComponent } from './alert/alert.component';

export function jwtOptionsFactory(tokenService: TokenService) {
  return {
    tokenGetter: () => {
      return tokenService.token;
    },
    allowedDomains: [environment.API_DOMAIN],
    skipWhenExpired: true
  }
}

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
    RegisterComponent,
    NotFoundErorComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [TokenService]
      }
    }),
    RouterModule.forRoot([
      {
        path: "",
        component: HomeComponent,
      }, {
        path: "home",
        component: HomeComponent,
      }, {
        path: "login",
        component: LoginComponent
      }, {
        path: "register",
        component: RegisterComponent
      }, {
        path: "foods",
        component: FoodsComponent
      }, {
        path: "foods/add",
        component: AddEditComponent
      }, {
        path: "foods/:foodId",
        component: FoodComponent
      }, {
        path: "foods/:foodId/edit",
        component: AddEditComponent
      }, {
        path: '**',
        component: NotFoundErorComponent
      }
    ], {
      onSameUrlNavigation: 'reload'
    }),
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
