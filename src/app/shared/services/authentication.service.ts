import { Injectable} from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthenticationService {
  public token: string;
  private apollo: Apollo;

  constructor(apollo: Apollo) {
    // set token if saved in local storage
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;

    this.apollo = apollo;
  }

  private getToken: any = gql`
        query getJWT($username: String!, $password: String!) {
          getJWT(username: $username, password: $password) {
           	success
           	error
           	token
           	}
        }
      `;


  login(username, password): Promise<boolean> {
    return this.apollo.query({
      //get Token from Server for user-password combination
      query: this.getToken,
      variables: {
        username: username,
        password: password
      }
    })
      .toPromise()
      .then(({data}: ApolloQueryResult<any>) => {
        if (data.getJWT.success) {
          //Store Token in local Storage
          localStorage.setItem('currentUser', JSON.stringify({ username: username, token: data.getJWT.token }));
          return true;
        }
        else {
          return false;
        }
      });

  };

  logout(): void {
    // clear token remove user from local storage to log user out
    this.token = null;
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): string {
    if (localStorage.getItem('currentUser')) {
      return JSON.parse(localStorage.getItem('currentUser')).username;
    }
    else {
      return 'Gast';
    }
  }

}
