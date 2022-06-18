import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

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

  hasAlert: boolean = false;
  alert_type!: string;
  alert_message!: string;

  constructor(private authService: AuthService, private usersServie: UsersService, private router: Router, private route:ActivatedRoute) { }
  currentUrl!:string;
  previousUrl!:string;

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.gotoHome();
    }
    
    this.route.queryParams.subscribe(params => {
      if(params['s'] == "true"){
        // to make sure url is not edited
        if(localStorage.getItem('s') == "true"){ 
          localStorage.removeItem('s');
          this.hasAlert = true;
          this.alert_message = environment.REGISTRATION_SUCCESS_REDIRECTION;
          this.alert_type = environment.SUCCESS_ALERT_TYPE;
        }
      }
    });
  }

  login(): void {
    this.usersServie.login(this.loginForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          if (this.authService.login(response._token)) {
            // this.hasAlert = true;
            // this.alert_type = environment.SUCCESS_ALERT_TYPE;
            // this.alert_message = environment.LOGIN_SUCCESS;
            // this.hideAlertAfterSomeTime();
            this.gotoHome();
            return;
          }
        }
        this.hasAlert = true;
        this.alert_type = environment.ERROR_ALERT_TYPE;
        this.alert_message = environment.LOGIN_ERROR_WITH_UNKNOWN_REASON;
        this.hideAlertAfterSomeTime();
      },
      error: err => {
        this.hasAlert = true;
        this.alert_type = environment.ERROR_ALERT_TYPE;
        this.alert_message = environment.LOGIN_ERROR_BY_USERNAME_PASSWORD_WRONG;
        this.hideAlertAfterSomeTime();
      }
    })
  }

  gotoHome(): void {
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/home']));
  }

  hideAlertAfterSomeTime(): void {
    setTimeout(() => {
      this.hasAlert = false;
    }, environment.ALERT_HIDE_TIME_IN_SECOND);
  }
}
