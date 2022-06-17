import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registrationForm!:FormGroup;

  isLoggedIn!:boolean;

  constructor(private formBuilder:FormBuilder, private usersService:UsersService, private authService:AuthService, private router:Router) {
    this.registrationForm = formBuilder.group({
        name : "",
        email : "",
        username: "",
        password:"",
        repeatPassword:""
    });}

  ngOnInit(): void {
    if(this.authService.isLoggedIn()){
        this.router.navigate(['/home']);
    }
  }

  register():void{
    this.usersService.addUser(this.registrationForm.value).subscribe({
      next:(user) =>{
        console.log(user);
      },
      error:(err) =>{
        console.log(err);
      },
      complete: ()=>{
        console.log("response received");
      }
    });
  }
}
