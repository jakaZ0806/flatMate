/**
 * Created by Lukas on 16-Nov-16.
 */

import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { Client } from 'subscriptions-transport-ws';
import { addGraphQLSubscriptions } from "./subscriptions";
import { environment } from '../../environments/environment';

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
    // get the authentication token from local storage if it exists
    req.options.headers = {'x-access-token': JSON.parse(localStorage.getItem('currentUser')).token || null };
    next();
  }
}]);

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions
});

export {
  client
}
