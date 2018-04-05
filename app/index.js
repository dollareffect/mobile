import React, { PureComponent } from 'react';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { configureStore, apolloClient } from './lib/configureStore';
import { AppSwitchNavigator } from './config/routes';

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

  componentDidCatch(error, info) {
    console.log('error: ', error);
    console.log('info: ', info);
  }

  render() {
    return (
      <ApolloProvider client={this.state.client}>
        <Provider store={this.state.store}>
          <PersistGate loading={null} persistor={this.state.persistor}>
            <AppSwitchNavigator />
          </PersistGate>
        </Provider>
      </ApolloProvider>
    );
  }
}
