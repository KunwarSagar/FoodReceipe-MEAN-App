import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

class Credentials{
  #_username:string;
  #_password:string;

  constructor(username:string, password:string){
    this.#_username = username;
    this.#_password = password;
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

  userCredentials:Credentials = new Credentials("Sagar", "password");

  constructor() { }

  ngOnInit(): void {
  }


  login():void{
    console.log(this.userCredentials);
    // console.log(this.loginForm.value);
    
  }

}
