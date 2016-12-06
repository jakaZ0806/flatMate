import { Component, OnInit } from '@angular/core';
import { Angular2Apollo, ApolloQueryObservable } from 'angular2-apollo';
import { ApolloQueryResult } from 'apollo-client';
import { FormControl } from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
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
  public user: any;
  public loading: boolean;
  private subscriptionObserver: Subscription;
  private subscriptionQuery: any = gql`
  subscription userAdded($firstName: String!){
    userAdded(firstName: $firstName){
      id
      }
  }`;
  private entrySub: Subscription;

  private apollo: Angular2Apollo;

  constructor(apollo: Angular2Apollo) {
    this.apollo = apollo;
  }

  ngOnInit() {
    this.users = this.apollo.watchQuery({
      query: queryAllUsers
    });

    this.entrySub = this.users.subscribe(({data, loading}) => {
      this.user = data.user;
      this.loading = loading;
    });
    this.subscribe();

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

        // get new data
        this.users.refetch();
      })
      .catch((errors: any) => {
        console.log('there was an error sending the query', errors);
      });
  }

  private subscribe(){
    // call the "subscribe" method on Apollo Client
    this.subscriptionObserver = this.apollo.subscribe({
      query: this.subscriptionQuery,
      variables: {firstName: 'test'}
    }).subscribe({
      next: (data) => {
        const newUser = data.userAdded;
        console.log('Received Data from Subscription with ID: ' + newUser.id);
      },
      error(err) { console.error('err', err); },
    });
  }

}
