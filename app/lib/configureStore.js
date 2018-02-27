import { createStore, applyMiddleware } from 'redux';
import { purgeStoredState, persistStore } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { AsyncStorage } from 'react-native';
import reducers from '../reducers';
import graphqlClient from './graphqlClient';

const middleware = applyMiddleware(thunk, createLogger);
const enchancer = composeWithDevTools(middleware);
const store = createStore(reducers, enchancer);

let persistor = null;

export function configureStore() {
  persistor = persistStore(store);
  return { persistor, store };
}

export function purgeStore() {
  graphqlClient.resetStore().then(() => {
    purgeStoredState({ storage: AsyncStorage });
  });
}

export const apolloClient = graphqlClient;
