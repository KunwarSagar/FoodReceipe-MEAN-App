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
      this.hasAlert = true;
      this.alert_type = environment.ERROR_ALERT_TYPE;
      this.alert_message = environment.REPEAT_PASSWORD_NOT_MATCH;
      this.hideAlertAfterSomeTime();
      return;
    }
    this.usersService.addUser(this.registrationForm.value).subscribe({
      next: (user) => {
        if (user) {
          // this.hasAlert = true;
          // this.alert_type = environment.SUCCESS_ALERT_TYPE;
          // this.alert_message = environment.REGISTRATION_SUCCESS;
          // this.hideAlertAfterSomeTime();
          this.goToLogin();
          return;
        }
      },
      error: (err) => {
        this.hasAlert = true;
        this.alert_type = environment.ERROR_ALERT_TYPE;
        this.alert_message = environment.REGISTRATION_FAILED;
        this.hideAlertAfterSomeTime();
      }
    });
  }

  /**
   * redirect to login
   */
  goToLogin(): void {
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => {
        localStorage.setItem("s","true");
        this.router.navigate(['/login'], {queryParams:{s:true}})
      });
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
