import {
  ApolloClient,
  InMemoryCache,
  defaultDataIdFromObject,
} from 'apollo-client-preset';
import { execute, makePromise, concat } from 'apollo-link';
import fetch from 'node-fetch';
import { setContext } from 'apollo-link-context';
import { BatchHttpLink } from 'apollo-link-batch-http';
import Config from 'react-native-config';
import { AsyncStorage } from 'react-native';
import moment from 'moment';
import gql from 'graphql-tag';
import {
  USER_TOKEN_KEY,
  USER_ID_KEY,
  USER_TOKEN_EXPIRATION_KEY,
  USER_REFRESH_TOKEN_KEY,
} from '../config/constants';

const httpLink = new BatchHttpLink({
  uri: Config.GRAPHQL_URL,
  batchInterval: 10, // in milliseconds
  batchMax: 10,
  fetch,
});

const authMiddleware = setContext(async (operation, { headers }) => {
  // add the authorization to the headers
  const customHeaders = {
    'Accept-Encoding': 'gzip',
  };

  const token = await refreshTokenIfNeeded();
  if (token) {
    customHeaders.Authorization = token;
  }
  return { headers: { ...headers, ...customHeaders } };
});

const cache = new InMemoryCache({
  dataIdFromObject: object => {
    if (object.__typename) {
      return `${object.__typename}:${object.id}`;
    }
    return defaultDataIdFromObject(object); // fall back to default handling
  },
});

const client = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache,
});

const refreshTokenIfNeeded = async () => {
  // check if we have existing token
  const token = await AsyncStorage.getItem(USER_TOKEN_KEY);
  if (!token) return null;
  // next we check if token already expired
  const tokenExpiration = moment(
    await AsyncStorage.getItem(USER_TOKEN_EXPIRATION_KEY),
  );

  if (tokenExpiration.isAfter(moment())) return token; // token still valid
  // refresh token
  const refreshToken = await AsyncStorage.getItem(USER_REFRESH_TOKEN_KEY);
  const userId = await AsyncStorage.getItem(USER_ID_KEY);

  const operation = {
    query: gql`
      mutation refreshToken($token: String!, $userId: ID!) {
        refreshToken(token: $token, userId: $userId) {
          token
          refreshToken
        }
      }
    `,
    variables: {
      token: refreshToken,
      userId,
    },
  };

  return makePromise(execute(httpLink, operation))
    .then(async ({ data }) => {
      const tokenExpirationDate = moment().add('1', 'hours');
      await AsyncStorage.multiSet([
        [USER_TOKEN_KEY, data.refreshToken.token],
        [USER_REFRESH_TOKEN_KEY, data.refreshToken.refreshToken],
        [USER_TOKEN_EXPIRATION_KEY, tokenExpirationDate.format()],
      ]);
      return data.refreshToken.token;
    })
    .catch(error => console.log(`received error ${error}`));
};

export default client;
