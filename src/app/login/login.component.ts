import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Apollo} from 'apollo-angular';


import { AuthenticationService } from '../shared/services/authentication.service';
import {ApolloQueryResult} from "apollo-client";
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  error = '';

  private apollo: Apollo;

  private addUser:any = gql`
        mutation addUser($firstName: String!, $lastName: String!, $username: String!, $password: String!, $admin: Boolean!) {
          addUser(firstName: $firstName, lastName: $lastName, username: $username, password: $password, admin: $admin) {
            firstName
            lastName
            username
            password
          } 	
        }
      `;


  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    apollo: Apollo) {

    this.apollo = apollo;
  }


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

  createAdminUser(username, password, firstName, lastName) {
    alert(username + password + firstName + lastName);
    this.apollo.mutate({
      mutation: this.addUser,
      variables: {
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: password,
        admin: true
      },
    })
      .toPromise()
      .then(({data}: ApolloQueryResult<any>) => {
        if (data.ApolloError) {
          console.log(data.ApolloError.message);
        }

        alert('success');
      })
      .catch((errors:any) => {
        console.log('there was an error sending the query', errors);
      });
  }
}
