/**
 * Created by Lukas on 16-Nov-16.
 */

import { ApolloClient, createNetworkInterface } from 'apollo-client';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: '/graphql',
    opts: {
      credentials: 'same-origin',
    },
  }),
});

export {
  client
}
