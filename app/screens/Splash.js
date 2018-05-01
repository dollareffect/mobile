import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import Splash from '../components/Splash';

type Props = {};
export default class SplashScreen extends Component<Props> {
  static navigationOptions = {
    header: null,
  };

  onPressSignUp = () => {
    const { navigate } = this.props.navigation;
    navigate('SignUp');
  };

  onLoginSuccess = () => {
    const { navigate } = this.props.navigation;
    navigate('App');
  };

  onPressLoginWithEmail = () => {
    const { navigate } = this.props.navigation;
    navigate('Login');
  };

  onSignUpWithFacebook = fbProfile => {
    const { navigate } = this.props.navigation;
    navigate('SignUp', {
      fbProfile,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Splash
          onPressSignUp={this.onPressSignUp}
          onLoginSuccess={this.onLoginSuccess}
          onSignUpWithFacebook={this.onSignUpWithFacebook}
          onPressLoginWithEmail={this.onPressLoginWithEmail}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F7FBFC',
    paddingLeft: 20,
    paddingRight: 20,
  },
});
