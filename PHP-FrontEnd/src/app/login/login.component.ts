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

  constructor(private authService: AuthService, private usersServie: UsersService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // if already logged in go to foods
    if (this.authService.isLoggedIn()) {
      this.gotoFoods();
    }

    this.route.queryParams.subscribe(params => {
      if (params['s'] == "true") {
        // to make sure url is not edited
        if (localStorage.getItem('s') == "true") {
          localStorage.removeItem('s');
          this.hasAlert = true;
          this.alert_message = environment.REGISTRATION_SUCCESS_REDIRECTION;
          this.alert_type = environment.SUCCESS_ALERT_TYPE;
          this.hideAlertAfterSomeTime();
        }
      }
    });
  }

  /**
   * login
   */
  login(): void {

    if (this.loginForm.value.username == "" || this.loginForm.value.password == "") {
      this.showAlert(environment.ERROR_ALERT_TYPE, environment.ALL_FIELDS_REQUIRED);
      this.hideAlertAfterSomeTime();
      return;
    }


    this.usersServie.login(this.loginForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          if (this.authService.login(response._token)) {
            this.showAlert(environment.SUCCESS_ALERT_TYPE, environment.LOGIN_SUCCESS);
            localStorage.setItem('l', "true");
            this.gotoFoods();
            return;
          }
        }
        this.showAlert(environment.ERROR_ALERT_TYPE, environment.LOGIN_ERROR_WITH_UNKNOWN_REASON);
      },
      error: err => {
        this.showAlert(environment.ERROR_ALERT_TYPE, environment.LOGIN_ERROR_BY_USERNAME_PASSWORD_WRONG);
      }
    })
  }

  /**
   * redirect to foods routes
   */
  gotoFoods(): void {
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => {
        this.router.navigate(['/foods'], { queryParams: { l: true } })
      });
  }

  /**
* show alerts
* @param alert_type 
* @param message 
*/
  showAlert(alert_type: string, message: string): void {
    this.hasAlert = true;
    this.alert_type = alert_type;
    this.alert_message = message;
    this.hideAlertAfterSomeTime();
  }

  /**
   * hide alert after some time
   */
  hideAlertAfterSomeTime(): void {
    setTimeout(() => {
      this.hasAlert = false;
    }, environment.ALERT_HIDE_TIME_IN_SECOND);
  }
}
