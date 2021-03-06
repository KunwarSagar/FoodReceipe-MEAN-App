import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  /**
   * set token
   */
  set token(_token: any) {
    sessionStorage.setItem(environment.TOKEN_KEY, _token);
  }

  /** 
   * get token
  */
  get token() {
    return sessionStorage.getItem(environment.TOKEN_KEY);
  }

  /**
   * delete token from sessionStorage
   */
  deleteToken() {
    sessionStorage.clear();
  }

  /**
   * set jwtSeervice as DI
   */
  #jwtService!:JwtHelperService;

  set jwtService(jwtService:JwtHelperService){
    this.#jwtService = jwtService;
  }

  /**
   * get name from the token
   */
  #name!:string;
  get name() {
    if (this.token) {
      this.#name = this.#jwtService.decodeToken(this.token).name;
    }
    return this.#name;
  }
}