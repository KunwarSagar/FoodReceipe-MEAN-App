import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

class User{
  #name!:string;
  #username!:string;
  #password!:string;
  #email!:string;

  constructor(){}

  get name(){
    return this.#name
  }

  set name(name){
    this.#name = name;
  }
  get email(){
    return this.#email
  }

  set email(email){
    this.#email = email;
  }
  get username(){
    return this.#username
  }

  set username(username){
    this.#username = username;
  }
  get password(){
    return this.#password
  }

  set password(password){
    this.#password = password;
  }
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseUrl: string = environment.API_BASE_URL;
  
  constructor(private http:HttpClient) { }
  
  public addUser(userData:FormGroup):Observable<User>{
    return this.http.post<User>(this.baseUrl+'/users', userData);
  }
  
  public login(userCredentials: NgForm):Observable<any> {
    return this.http.put<any>(this.baseUrl+"/users", userCredentials);
  }
}
