/**
 * Created by Lukas on 16-Nov-16.
 */

import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { Client } from 'subscriptions-transport-ws';
import { addGraphQLSubscriptions } from "./subscriptions";
import { environment } from '../../environments/environment';
import { JwtHelper } from 'angular2-jwt';
import {AuthGuard} from "../auth-guard";

const jwtHelper: JwtHelper = new JwtHelper();

const getClientError = errors => {
  if (!errors) return;
  const error = errors[0].message;
  return (error.indexOf('{"_error"') === -1) ? {_error: 'Server query error'} : JSON.parse(error);
};


const wsClient = new Client('ws://' + environment.wsUrl + ':8080');


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
    var token = JSON.parse(localStorage.getItem('currentUser')).token;
    if(jwtHelper.isTokenExpired(token)) {    };
    // get the authentication token from local storage if it exists
    req.options.headers = {'Authorization': 'Bearer ' + token || null };
    next();
  }
}]);

/*
networkInterface.useAfter([{
  applyAfterware({response}, next) {
    const resJSON = response.json();
    const {data, errors} = resJSON;
    console.log( {data, error: getClientError(errors)});
    next();
  }
}]);
*/

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions
});

export {
  client
}
