import {Component, OnInit, Input, ChangeDetectorRef} from '@angular/core';
import { Angular2Apollo, ApolloQueryObservable } from 'angular2-apollo';
import { ApolloQueryResult } from 'apollo-client';
import {Subscription} from 'rxjs/Subscription';


import gql from 'graphql-tag';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs";

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
  public currentTime: string;
  private subscriptionObserver: Subscription;
  private subscriptionQuery: any = gql`
  subscription userAdded{
    userAdded{
      id
      }
  }`;
  private timerQuery: any = gql`
  subscription timeSub{
    timeSub{
      time
      }
  }`;

  private apollo: Angular2Apollo;

  constructor(apollo: Angular2Apollo, private cd: ChangeDetectorRef) {
    this.apollo = apollo;
  }

  ngOnInit() {
    this.users = this.apollo.watchQuery({
      query: queryAllUsers
    });


    this.subscribe();
    this.subscribeToTimer();

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
      variables: {}
    }).subscribe({
      next: (data) => {
        const newUser = data.userAdded;
        console.log('Received Data from Subscription with ID: ' + newUser.id);
        this.users.refetch();
        this.cd.detectChanges();
      },
      error(err) { console.error('err', err); },
    });
  }

  private subscribeToTimer(){
    // call the "subscribe" method on Apollo Client
    this.subscriptionObserver = this.apollo.subscribe({
      query: this.timerQuery,
      variables: {}
    }).subscribe({
      next: (data) => {
        const currentTimer = data.timeSub;
        console.log('Received Data from Subscription with Timecode: ' + currentTimer.time);
        this.currentTime = currentTimer.time;
        this.cd.detectChanges();
      },
      error(err) { console.error('err', err); },
    });
  }
}
