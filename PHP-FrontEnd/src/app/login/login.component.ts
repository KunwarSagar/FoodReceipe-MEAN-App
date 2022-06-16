import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../auth.service';

export class User{
  #_name!:string;
  #_email!:string;
  #_username:string;
  #_password:string;

  constructor(username:string, password:string){
    this.#_username = username;
    this.#_password = password;
  }

  get name(){
    return this.#_name;
  }
  set name(name){
    this.#_name = name;
  }

  get email(){
    return this.#_email;
  }
  set email(email){
    this.#_email = email;
  }

  get username(){
    return this.#_username;
  }
  set username(username){
    this.#_username = username;
  }

  get password(){
    return this.#_password;
  }

  set password(password){
    this.#_password = password;
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild("loginForm")
  loginForm! : NgForm;

  userCredentials:User = new User("", "");

  constructor(private authService:AuthService) { }

  ngOnInit(): void {
  }


  login():void{
    console.log(this.userCredentials);
    // console.log(this.loginForm.value);

  }

}
