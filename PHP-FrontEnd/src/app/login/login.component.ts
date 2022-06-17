import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild("loginForm")
  loginForm!: NgForm;

  username!: string;
  password!: string;

  constructor(private authService: AuthService, private usersServie: UsersService, private router: Router) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.gotoHome();
    }
  }

  login(): void {
    this.usersServie.login(this.loginForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          if (this.authService.login(response._token)) {
            this.gotoHome();
            return;
          }
        }
        console.log("error");
      },
      error: err => {
        console.log(err);
      }
    })
  }

  gotoHome(): void {
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/home']));
  }

}
