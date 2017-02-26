import {Component, OnInit, Input, ChangeDetectorRef} from '@angular/core';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import {Subscription} from 'rxjs/Subscription';


import gql from 'graphql-tag';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';



@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css'],
})


export class PlaygroundComponent implements OnInit {

  public users:ApolloQueryObservable<any>;
  public firstName:string;
  public lastName:string;
  public username:string;
  public password:string;
  public currentTime:string;
  private subscriptionObserver:Subscription;
  private subscriptionQuery:any = gql`
  subscription userChanged{
    userChanged{
      id
      }
  }`;
  private timerQuery:any = gql`
  subscription timeSub{
    timeSub{
      time
      }
  }`;

  private queryAllUsers:any = gql`
        query {
          users {
            firstName
            lastName
            username
            admin
          }
        }
      `;

  private addUser:any = gql`
        mutation addUser($firstName: String!, $lastName: String!, $username: String!, $password: String!) {
          addUser(firstName: $firstName, lastName: $lastName, username: $username, password: $password) {
            firstName
            lastName
            username
            password
          } 	
        }
      `;

  private getUserByUsername:any = gql`
        query getUser($username: String) {
          user(username: $username) {
            id
            username
            firstName
            lastName
          } 	
        }
      `;

  private getPassword:any = gql`
        query getUser($username: String!) {
          password(username: $username) 	
        }
      `;

  private mut_toggleTimer:any = gql`
        mutation toggleTimer {
        toggleTimer
        }
      `;

  private mut_deleteUser:any = gql`
         mutation deleteUser($username: String!) {
          deleteUser(username: $username) {
          username
          } 	
        }
      `;

  private apollo:Apollo;

  constructor(apollo:Apollo, private cd:ChangeDetectorRef) {
    this.apollo = apollo;
  }

  ngOnInit() {
    this.users = this.apollo.watchQuery({
      query: this.queryAllUsers
    });


    this.subscribe();
    this.subscribeToTimer();

  }

  public newUser(firstName:string) {
    // Call the mutation called addUser
    this.apollo.mutate({
      mutation: this.addUser,
      variables: {
        firstName,
        lastName: this.lastName,
        username: this.username,
        password: this.password,
      },
    })
      .toPromise()
      .then(({data}: ApolloQueryResult<any>) => {
        console.log(data);
        if (data.ApolloError) {
          console.log(data.ApolloError.message);
        }

        // get new data
        this.users.refetch();
      })
      .catch((errors:any) => {
        console.log('there was an error sending the query', errors);
      });
  }

  private subscribe() {
    // call the "subscribe" method on Apollo Client
    this.subscriptionObserver = this.apollo.subscribe({
      query: this.subscriptionQuery,
      variables: {}
    }).subscribe({
      next: (data) => {
        const newUser = data.userChanged;
        this.users.refetch();
        this.cd.detectChanges();
      },
      error(err) {
        console.error('err', err);
      },
    });
  }

  private subscribeToTimer() {
    // call the "subscribe" method on Apollo Client
    this.subscriptionObserver = this.apollo.subscribe({
      query: this.timerQuery,
      variables: {}
    }).subscribe({
      next: (data) => {
        const currentTimer = data.timeSub;
        this.currentTime = currentTimer.time;
        this.cd.detectChanges();
      },
      error(err) {
        console.error('err', err);
      },
    });
  }


  private getCurrentUser() {
    this.apollo.query({
      query: this.getUserByUsername,
      variables: {
        username: JSON.parse(localStorage.getItem('currentUser')).username
      }
    })
      .toPromise()
      .then(({data}: ApolloQueryResult<any>) => {
        const username = data.user.username;
        const userid = data.user.id;
        const firstName = data.user.firstName;
        const lastName = data.user.lastName;

        alert('You are ' + firstName + ' ' + lastName + ', your username is ' + username + ' and your user ID is ' + userid + '.')
      })

  };

  private getPasswordForUser(username) {
    if (username) {
      this.apollo.query({
        query: this.getPassword,
        variables: {
          username: username
        }
      })
        .toPromise()
        .then(({data}: ApolloQueryResult<any>) => {
          console.log(data);
          alert(JSON.stringify(data));
        })
    }
    else {
      alert('Enter a username!')
    }
  };

  private toggleTimer() {
    this.apollo.mutate({
      mutation: this.mut_toggleTimer,

    })
      .toPromise()
      .then(({data}: ApolloQueryResult<any>) => {
        alert('Timer active: ' + JSON.stringify(data.toggleTimer));
      })

  };

  private deleteUser(username) {
    this.apollo.mutate({
      mutation: this.mut_deleteUser,
      variables: {username : username}

    })
      .toPromise()
      .then(({data}: ApolloQueryResult<any>) => {
        console.log(data);
        this.users.refetch();
      })

  };

}
