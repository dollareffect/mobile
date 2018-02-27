import {
  ApolloClient,
  InMemoryCache,
  defaultDataIdFromObject
} from 'apollo-client-preset';
import { BatchHttpLink } from 'apollo-link-batch-http';
import Config from 'react-native-config';

const httpLink = new BatchHttpLink({
  uri: Config.GRAPHQL_URL,
  batchInterval: 10, // in milliseconds
  batchMax: 10
});

const cache = new InMemoryCache({
  dataIdFromObject: object => {
    if (object.__typename) {
      return `${object.__typename}:${object.id}`;
    }
    return defaultDataIdFromObject(object); // fall back to default handling
  }
});

const client = new ApolloClient({
  link: httpLink,
  cache
});

export default client;
