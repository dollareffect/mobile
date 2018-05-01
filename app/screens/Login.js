import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import LoginForm from '../components/LoginForm';

type Props = {};
export default class LoginScreen extends Component<Props> {
  static navigationOptions = {};

  loginDidSuccess = () => {
    const { navigate } = this.props.navigation;
    navigate('App');
  };

  onPressSignUpButton = () => {
    const { navigate } = this.props.navigation;
    navigate('SignUp');
  };

  render() {
    return (
      <View style={styles.container}>
        <LoginForm
          loginDidSuccess={this.loginDidSuccess}
          onPressSignUpButton={this.onPressSignUpButton}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
