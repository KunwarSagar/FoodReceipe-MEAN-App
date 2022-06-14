import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registrationForm!:FormGroup;

  constructor(private formBuilder:FormBuilder) {
    this.registrationForm = formBuilder.group({
        name : "Sagar",
        username: "aquaman",
        password:"password",
        repeatPassword:"password"
    });}

  ngOnInit(): void {
  }
  register():void{
    console.log("Form ", this.registrationForm.value);
  }
}
