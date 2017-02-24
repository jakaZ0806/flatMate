import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';

const jwtHelper: JwtHelper = new JwtHelper();

@Injectable()
export class AuthGuard implements CanActivate{
  constructor(private router: Router) { }


  canActivate() {
    if (localStorage.getItem('currentUser') && !jwtHelper.isTokenExpired(JSON.parse(localStorage.getItem('currentUser')).token)) {
      //User is logged in
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }

}
