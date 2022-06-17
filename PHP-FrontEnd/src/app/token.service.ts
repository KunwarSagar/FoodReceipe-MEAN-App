import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  set token(_token: any) {
    sessionStorage.setItem("_token", _token);
  }

  get token() {
    return sessionStorage.getItem("_token");
  }

  deleteToken() {
    sessionStorage.clear();
  }

  #jwtService!:JwtHelperService;

  set jwtService(jwtService:JwtHelperService){
    this.#jwtService = jwtService;
  }

  #name: string = "unknown";
  get name() {
    if (this.token) {
      this.#name = this.#jwtService.decodeToken(this.token).name;
    }
    return this.#name;
  }
}