import { EventEmitter, Injectable, Output } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();

  constructor(private router: Router, private jwtService: JwtHelperService, private tokenService: TokenService) { }

  isTokenExpired(): boolean {
    return this.jwtService.isTokenExpired();
  }

  loggedInStateChanged(): EventEmitter<boolean> {
    return this.loggedIn;
  }

  isLoggedIn():boolean{
      return !this.isTokenExpired();
  }

  login(token: any): boolean {
    this.tokenService.token = token;
    this.loggedIn.emit(true);
    return this.isLoggedIn();
  }

  logout(): boolean {
    this.tokenService.deleteToken();
    this.loggedIn.emit(false);
    return !this.isLoggedIn();
  }

}
