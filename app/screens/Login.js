import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
  AsyncStorage,
} from 'react-native';
import { Button, SocialIcon } from 'react-native-elements';
import { graphql, compose } from 'react-apollo';
import _ from 'lodash';
import {
  LoginWithEmailMutation,
  LoginWithFacebookMutation,
} from '../graphql/mutations';
import { USER_TOKEN_KEY } from '../config/constants';
import * as facebook from '../lib/facebook';

type Props = {};
class LoginScreen extends Component<Props> {
  static navigationOptions = {
    header: null,
  };

  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      isLoggingInWithEmail: false,
      isLoggingInWithFacebook: false,
    };
  }

  saveToken = async token => {
    // save to async storage
    await AsyncStorage.setItem(USER_TOKEN_KEY, token);
  };

  loginDidSuccess = () => {
    const { navigate } = this.props.navigation;
    navigate('App');
  };

  loginWithFacebook = async () => {
    const facebookAccessToken = await facebook.currentAccessToken();
    return this.props
      .loginWithFacebook({
        variables: {
          facebookAccessToken,
        },
      })
      .then(async result => {
        console.log('result', result);
        await this.saveToken(result.data.loginWithFacebook.token);
        this.loginDidSuccess();
      })
      .catch(error => {
        console.log('error', error);
        // only how first graphql error
        const graphQLError = _.head(error.graphQLErrors);
        if (graphQLError != null) {
          if (_.startsWith(graphQLError.message, 'Could not find user')) {
            // means this is a new user then we should redirect to signup
            // fetch facebook profile to prefill signup form
            facebook.fetchProfile().then(fbProfile => {
              const { navigate } = this.props.navigation;
              navigate('SignUp', {
                fbProfile,
              });
            });
          }
        } else {
          throw Error(error.message);
        }
      });
  };

  onChangeEmailText = text => this.setState({ email: text });

  onChangePasswordText = text => this.setState({ password: text });

  onPressLoginButton = () => {
    Keyboard.dismiss();
    this.setState({
      isLoggingInWithEmail: true,
    });

    this.props
      .loginWithEmail({
        variables: {
          email: this.state.email.toLowerCase(),
          password: this.state.password,
        },
      })
      .then(async result => {
        console.log('result', result);
        await this.saveToken(result.data.login.token);
        this.loginDidSuccess();
      })
      .catch(error => {
        console.log('error', error);
        // only how first graphql error
        const graphQLError = _.head(error.graphQLErrors);
        if (graphQLError) {
          Alert.alert('Error', graphQLError.message, [{ text: 'OK' }], {
            cancelable: false,
          });
        } else {
          throw Error(error.message);
        }
      })
      .finally(() => {
        this.setState({
          isLoggingInWithEmail: false,
        });
      });
  };

  onPressFacebookButton = () => {
    Keyboard.dismiss();
    this.setState({
      isLoggingInWithFacebook: true,
    });

    facebook
      .login()
      .then(this.loginWithFacebook)
      .catch(error => {
        Alert.alert('Error', error.message, [{ text: 'OK' }], {
          cancelable: false,
        });
      })
      .finally(() => {
        this.setState({
          isLoggingInWithFacebook: false,
        });
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView>
          <Text style={styles.title}>Login</Text>
          <View style={styles.textInputContainer}>
            <Text style={styles.textInputTitle}>Email</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={this.onChangeEmailText}
              value={this.state.email}
              keyboardType="email-address"
              autoCapitalize="none"
              underlineColorAndroid="rgba(0,0,0,0)"
            />
          </View>

          <View style={styles.textInputContainer}>
            <Text style={styles.textInputTitle}>Password</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={this.onChangePasswordText}
              value={this.state.password}
              secureTextEntry
              underlineColorAndroid="rgba(0,0,0,0)"
            />
          </View>

          <Button
            containerViewStyle={styles.loginButtonContainer}
            buttonStyle={styles.loginButton}
            rounded
            title={this.state.isLoggingInWithEmail ? '' : 'Login'}
            loading={this.state.isLoggingInWithEmail}
            onPress={this.onPressLoginButton}
            disabled={
              this.state.isLoggingInWithEmail ||
              this.state.isLoggingInWithFacebook ||
              this.state.email.length === 0 ||
              this.state.password.length === 0
            }
          />

          <SocialIcon
            style={styles.facebookButton}
            title="Sign In With Facebook"
            button
            type="facebook"
            loading={this.state.isLoggingInWithFacebook}
            onPress={this.onPressFacebookButton}
            onLongPress={this.onPressFacebookButton}
            disabled={
              this.state.isLoggingInWithEmail ||
              this.state.isLoggingInWithFacebook
            }
          />
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
  },
  textInputContainer: {
    marginTop: 20,
  },
  textInputTitle: {
    fontSize: 12,
    marginBottom: 13,
  },
  textInput: {
    height: 50,
    borderColor: '#DAE0E4',
    backgroundColor: '#F3F6F8',
    borderWidth: 1,
    borderRadius: 4,
    paddingLeft: 10,
    paddingRight: 10,
  },
  loginButtonContainer: {
    marginTop: 40,
    marginLeft: 0,
    marginRight: 0,
  },
  loginButton: {
    height: 50,
  },
  facebookButtonContainer: {
    marginLeft: 0,
    marginRight: 0,
  },
  facebookButton: {
    marginLeft: 0,
    marginRight: 0,
    height: 50,
  },
});

const LoginWithEmail = graphql(LoginWithEmailMutation, {
  name: 'loginWithEmail',
});

const LoginWithFacebook = graphql(LoginWithFacebookMutation, {
  name: 'loginWithFacebook',
});

export default compose(LoginWithEmail, LoginWithFacebook)(LoginScreen);
