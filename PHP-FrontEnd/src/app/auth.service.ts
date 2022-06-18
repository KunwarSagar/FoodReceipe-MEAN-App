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

  /**
   * check if token expred
   * @returns 
   */
  isTokenExpired(): boolean {
    return this.jwtService.isTokenExpired();
  }

  /**
   * when state changes emit event
   * @returns 
   */
  loggedInStateChanged(): EventEmitter<boolean> {
    return this.loggedIn;
  }

  /**
   * check if logged in
   * @returns 
   */
  isLoggedIn():boolean{
      return !this.isTokenExpired();
  }

  /**
   * login
   * @param token 
   * @returns 
   */
  login(token: any): boolean {
    this.tokenService.token = token;
    this.loggedIn.emit(true);
    return this.isLoggedIn();
  }

  /**
   * logout
   * @returns 
   */
  logout(): boolean {
    this.tokenService.deleteToken();
    this.loggedIn.emit(false);
    return !this.isLoggedIn();
  }

}
