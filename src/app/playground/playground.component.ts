import { Component, OnInit } from '@angular/core';
import { Angular2Apollo, ApolloQueryObservable } from 'angular2-apollo';
import { ApolloQueryResult } from 'apollo-client';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

import gql from 'graphql-tag';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

const queryAllUsers = gql`
        query {
          users {
            firstName
            lastName
          }
        }
      `;



@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css'],
})


export class PlaygroundComponent implements OnInit {

  public users: ApolloQueryObservable<any>;
  public firstName: string;
  public lastName: string;
  public nameControl = new FormControl();
  public allUsers = [];
  loading: boolean;
  subscriptionObserver;

  private apollo: Angular2Apollo;

  constructor(apollo: Angular2Apollo) {
    this.apollo = apollo;
  }

  ngOnInit() {
    this.users = this.apollo.watchQuery({
      query: queryAllUsers
    });

    const updateQueryFunction = gql`
  subscription userAdded {userAdded {
     id
      }}`;

    this.subscribe(updateQueryFunction);
  }

  public newUser(firstName: string) {
    // Call the mutation called addUser
    this.apollo.mutate({
      mutation: gql`
        mutation M($firstName: String!, $lastName: String!) {
          addUser(firstName: $firstName, lastName: $lastName) {
            firstName
            lastName
          } 	
        }
      `,
      variables: {
        firstName,
        lastName: this.lastName,
      },
    })
      .toPromise()
      .then(({ data }: ApolloQueryResult) => {
        console.log('got data', data);

        // get new data
        this.users.refetch();
      })
      .catch((errors: any) => {
        console.log('there was an error sending the query', errors);
      });
  }

  private subscribe(updateQuery){
    // call the "subscribe" method on Apollo Client
    this.subscriptionObserver = this.apollo.subscribe({
      query: updateQuery,
    }).subscribe({
      next(data) {
        updateQuery();
      },
      error(err) { console.error('err', err); },
    });
  }

}
