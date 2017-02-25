/**
 * Created by Lukas on 02-Dec-16.
 */
import {print} from 'graphql-tag/printer';
import {SubscriptionClient} from 'subscriptions-transport-ws';

// quick way to add the subscribe and unsubscribe functions to the network interface
export function addGraphQLSubscriptions(networkInterface: any, wsClient: SubscriptionClient): any {
  return Object.assign(networkInterface, {
    subscribe(request: any, handler: any): number {
      return wsClient.subscribe({
        query: print(request.query),
        variables: request.variables,
      }, handler);
    },
    unsubscribe(id: number): void {
      wsClient.unsubscribe(id);
    }
  });
}
