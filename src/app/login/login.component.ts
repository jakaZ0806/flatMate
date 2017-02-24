import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../shared/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  error = '';

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();
  }

  login() {
    this.authenticationService.login(this.model.username, this.model.password)
      .then(result => {
        console.log('loginresult: ' + result);
          if (result) {
            // login successful
            this.router.navigate(['/']);
          } else {
            // login failed
            this.error = 'Username or password is incorrect';
            this.loading = false;
          }

        }
      )
  }
}
