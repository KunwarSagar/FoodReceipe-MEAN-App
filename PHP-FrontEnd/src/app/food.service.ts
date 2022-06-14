import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Food } from './foods/foods.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private baseUrl: string = environment.API_BASE_URL;

  constructor(private http: HttpClient) { }

  public getAll(queryParams: any = {searchString: "", count: 0, offset: 0, page:1}): Observable<Food[]> {
    let url = this.baseUrl + "/foods";
    let appendNewQuery = false;

    if (queryParams.searchString != "" || queryParams.count > 0 || queryParams.offset > 0) {
      if (queryParams.searchString != "") {
        appendNewQuery = true;
        url += "?searchString=" + queryParams.searchString;
        if (queryParams.count > 0) {
          url += "&count=" + queryParams.count;
          if (queryParams.offset > 0) {
            url += "&offset=" + queryParams.offset;
          }
        } else {
          if (queryParams.offset > 0) {
            url += "&offset=" + queryParams.offset;
          }
        }
      } else {
        if (queryParams.count > 0) {
          appendNewQuery = true;
          url += "?count=" + queryParams.count;
          if (queryParams.offset > 0) {
            url += "&offset=" + queryParams.offset;
          }
        } else {
          if (queryParams.offset > 0) {
            appendNewQuery = true;
            url += "?offset=" + queryParams.offset;
          }
        }
      }
    }

    if(appendNewQuery){
      url += "&page=" + queryParams.page;
    }else{
      if (queryParams.page > 1) {
        url += "?page=" + queryParams.page;
      }
    }

    return this.http.get<Food[]>(url);
  }

  public getSize(): Observable<any> {
    return this.http.get<any>(this.baseUrl + "/foods/size");
  }

  public getFood(foodId: string): Observable<Food> {
    return this.http.get<Food>(this.baseUrl + "/foods/" + foodId);
  }

  public addUpdateFood(food: FormData, isUpdate: boolean): Observable<Food> {
    let url = this.baseUrl + "/foods";
    if (isUpdate) {
      return this.http.put<Food>(url + "/" + food.get('_id'), food);
    } else {
      return this.http.post<Food>(url, food);
    }
  }

  public addThumbnail(thumbnail: FormData): Observable<Food> {
    return this.http.post<Food>(this.baseUrl + "/foods/addThumbnail", thumbnail);
  }

  public deleteFood(foodId: string): Observable<Food> {
    return this.http.delete<Food>(this.baseUrl + "/foods/" + foodId);
  }
}
