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

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions
});



export {
  client
}
