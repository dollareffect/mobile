import React, { PureComponent } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { Button } from 'react-native-elements';
import ViewPropTypes from 'ViewPropTypes';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import _ from 'lodash';
import { saveToken } from '../../lib/authStorage';
import TextInputWithTitle from '../TextInputWithTitle';
import { LoginWithEmailMutation } from '../../graphql/mutations';
import styles from './styles';

type Props = {
  containerStyle: mixed,
  loginDidSuccess: () => void,
  onPressSignUpButton: () => void,
};

class LoginForm extends PureComponent<Props> {
  static propTypes = {
    containerStyle: ViewPropTypes.style,
    loginDidSuccess: PropTypes.func,
    onPressSignUpButton: PropTypes.func,
  };

  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      isLoggingInWithEmail: false,
    };
  }

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
        await saveToken(
          result.data.login.token,
          result.data.login.refreshToken,
          result.data.login.user.id,
        );

        this.props.loginDidSuccess();
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
        this.setState({
          isLoggingInWithEmail: false,
        });
      });
  };

  onPressSignUpButton = () => {
    this.props.onPressSignUpButton();
  };

  render() {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <KeyboardAvoidingView>
          <ImageBackground
            source={require('../../images/gradient-header.png')}
            style={styles.header}>
            <Text style={styles.title}>Welcome back!</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </ImageBackground>
          <View style={styles.formContainer}>
            <TextInputWithTitle
              title="EMAIL"
              containerStyle={[styles.textInputContainer]}
              textInputProps={{
                value: this.state.email,
                onChangeText: this.onChangeEmailText,
                keyboardType: 'email-address',
                autoCapitalize: 'none',
              }}
            />

            <TextInputWithTitle
              title="PASSWORD"
              containerStyle={[styles.textInputContainer]}
              textInputProps={{
                value: this.state.password,
                onChangeText: this.onChangePasswordText,
                secureTextEntry: true,
              }}
            />

            <Button
              containerViewStyle={styles.loginButtonContainer}
              buttonStyle={styles.loginButton}
              backgroundColor="#209CFF"
              rounded
              title={this.state.isLoggingInWithEmail ? '' : 'LOGIN'}
              loading={this.state.isLoggingInWithEmail}
              onPress={this.onPressLoginButton}
              disabled={
                this.state.isLoggingInWithEmail ||
                this.state.isLoggingInWithFacebook ||
                this.state.email.length === 0 ||
                this.state.password.length === 0
              }
            />
            <TouchableOpacity
              style={styles.footerButton}
              onPress={this.onPressSignUpButton}>
              <View style={styles.footerTextContainer}>
                <Text style={styles.footerButtonText}>
                  Don&apos;t have an account?{' '}
                </Text>
                <Text style={[styles.footerButtonText, styles.signUpText]}>
                  Sign Up
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const LoginWithEmail = graphql(LoginWithEmailMutation, {
  name: 'loginWithEmail',
});

export default compose(LoginWithEmail)(LoginForm);
