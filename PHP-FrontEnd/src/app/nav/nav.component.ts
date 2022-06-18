import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { TokenService } from '../token.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService, private tokenService: TokenService) { }

  isLoggedIn!: boolean;
  name!: string;

  ngOnInit(): void {
    //set state when page is reloaded
    this.isLoggedIn = this.authService.isLoggedIn();
    //set state on event
    this.authService.loggedInStateChanged().subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
      this.setName();
    });
    
    this.setName();
  }

  setName() {
    if (this.isLoggedIn) {
      let jwtService = new JwtHelperService();
      this.tokenService.jwtService = jwtService;
      this.name = this.tokenService.name;
    }else{
      this.name = "";
    }
  }

  goToFoods(): void {
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/foods']));
  }

  logout(): void {
    if (this.authService.logout()) {
      this.setName();
      this.gotoLogin();
      return;
    } else {
      alert(environment.LOGOUT_FAILED)
    }
  }
  gotoLogin(): void {
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/login']));
  }
}

