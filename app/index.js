import React, { PureComponent } from 'react';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { configureStore, apolloClient } from './lib/configureStore';
import Hello from './screens/Hello';

export default class App extends PureComponent {
  constructor() {
    super();

    const { persistor, store } = configureStore();

    this.state = {
      client: apolloClient,
      persistor,
      store,
    };
  }

  render() {
    return (
      <ApolloProvider client={this.state.client}>
        <Provider store={this.state.store}>
          <PersistGate persistor={this.state.persistor}>
            <Hello />
          </PersistGate>
        </Provider>
      </ApolloProvider>
    );
  }
}
