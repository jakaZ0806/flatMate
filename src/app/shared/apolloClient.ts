/**
 * Created by Lukas on 16-Nov-16.
 */

import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { addGraphQLSubscriptions } from "./subscriptions";
import { environment } from '../../environments/environment';
import { JwtHelper } from 'angular2-jwt';

const jwtHelper: JwtHelper = new JwtHelper();

const wsClient = new SubscriptionClient('ws://' + environment.wsUrl + ':8080', {
  reconnect: true
});


const networkInterface = createNetworkInterface({
  uri: '/graphql/',
  opts: {
    credentials: 'same-origin',
  },
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions (
  networkInterface,
  wsClient
);

//Add JWT Support for Authorization: Add Auth Token to every graphQL-Request
networkInterface.use([{
  applyMiddleware(req, next) {
    //If no current User is stored in localStorage, it is not possible to add a token to the request
    if (localStorage.getItem('currentUser')) {
      var token = JSON.parse(localStorage.getItem('currentUser')).token;
      //Helper Function for expired Tokens
      if (jwtHelper.isTokenExpired(token)) {
        token = null;
      }
      // get the authentication token from local storage if it exists
      req.options.headers = {'Authorization': 'Bearer ' + token || null};
    }
    next();
  }
}]);


const client = new ApolloClient({networkInterface: networkInterfaceWithSubscriptions });

export function getClient(): ApolloClient {
  return client;
  }
