import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Food } from './foods/foods.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private baseUrl:string = environment.API_BASE_URL;

  constructor(private http:HttpClient) { }

  getHeaders(){
    return new HttpHeaders({
      'Content-Type':'application/json'
    });
  }

  public getAll(page:number = 1):Observable<Food[]>{
    let url = this.baseUrl + "/foods";
    if(page > 1){
      url += "?page="+page;
    }
    return this.http.get<Food[]>(url);
  }

  public getSize():Observable<any>{
    return this.http.get<any>(this.baseUrl + "/foods/size");
  }
 
  public getFood(foodId:string):Observable<Food>{
    return this.http.get<Food>(this.baseUrl + "/foods/"+foodId);
  }

  public addUpdateFood(food:Food, isUpdate:boolean):Observable<Food>{
    let url = this.baseUrl + "/foods";
    if(isUpdate){
      return this.http.put<Food>(url+"/"+food._id, food, {headers:this.getHeaders()});
    }else{      
      return this.http.post<Food>(url, food, {headers:this.getHeaders()});
    }
  }

  public deleteFood(foodId:string):Observable<Food>{
    return this.http.delete<Food>(this.baseUrl+"/foods/"+foodId);
  }
}
