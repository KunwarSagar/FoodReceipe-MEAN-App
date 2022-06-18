import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

import { AuthService } from '../auth.service';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registrationForm!: FormGroup;

  isLoggedIn!: boolean;

  hasAlert: boolean = false;
  alert_type!: string;
  alert_message!: string;

  constructor(private formBuilder: FormBuilder, private usersService: UsersService, private authService: AuthService, private router: Router) {
    this.registrationForm = formBuilder.group({
      name: "",
      email: "",
      username: "",
      password: "",
      repeatPassword: ""
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  /**
   * register
   * @returns void
   */
  register(): void {

    const formValue = this.registrationForm.value;
    if (formValue.password != formValue.repeatPassword) {
      this.showAlert(environment.ERROR_ALERT_TYPE, environment.REPEAT_PASSWORD_NOT_MATCH);
      return;
    }
    this.usersService.addUser(this.registrationForm.value).subscribe({
      next: (user) => {
        if (user) {
          this.showAlert(environment.SUCCESS_ALERT_TYPE, environment.REGISTRATION_SUCCESS);
          this.goToLogin();
          return;
        }
        this.showAlert(environment.ERROR_ALERT_TYPE, environment.REGISTRATION_FAILED);
      },
      error: (err) => {
        this.showAlert(environment.ERROR_ALERT_TYPE, environment.REGISTRATION_FAILED);
      }
    });
  }

  /**
   * redirect to login
   */
  goToLogin(): void {
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => {
        localStorage.setItem("s", "true");
        this.router.navigate(['/login'], { queryParams: { s: true } })
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
   * hide alert after certain time
   */
  hideAlertAfterSomeTime(): void {
    setTimeout(() => {
      this.hasAlert = false;
    }, environment.ALERT_HIDE_TIME_IN_SECOND);
  }
}
