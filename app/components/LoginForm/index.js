import React, { PureComponent } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
} from 'react-native';
import { Button, SocialIcon } from 'react-native-elements';
import ViewPropTypes from 'ViewPropTypes';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import _ from 'lodash';
import { saveToken } from '../../lib/authStorage';
import TextInputWithTitle from '../TextInputWithTitle';
import {
  LoginWithEmailMutation,
  LoginWithFacebookMutation,
} from '../../graphql/mutations';
import * as facebook from '../../lib/facebook';
import styles from './styles';

type Props = {
  containerStyle: mixed,
  loginDidSuccess?: () => void,
};

class LoginForm extends PureComponent<Props> {
  static propTypes = {
    containerStyle: ViewPropTypes.style,
    loginDidSuccess: PropTypes.func,
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
        await saveToken(
          result.data.loginWithFacebook.token,
          result.data.loginWithFacebook.refreshToken,
          result.data.loginWithFacebook.user.id,
        );
        this.props.loginDidSuccess();
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
        this.setState({
          isLoggingInWithFacebook: false,
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
          <Text style={styles.title}>Login</Text>
          <TextInputWithTitle
            containerStyle={[styles.textInputContainer]}
            textInputProps={{
              value: this.state.email,
              onChangeText: this.onChangeEmailText,
              keyboardType: 'email-address',
              autoCapitalize: 'none',
            }}
          />

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

          <Button
            containerViewStyle={styles.signUpButtonContainer}
            buttonStyle={styles.signUpButton}
            rounded
            title="Sign Up with Email"
            onPress={this.onPressSignUpButton}
          />
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const LoginWithEmail = graphql(LoginWithEmailMutation, {
  name: 'loginWithEmail',
});

const LoginWithFacebook = graphql(LoginWithFacebookMutation, {
  name: 'loginWithFacebook',
});

export default compose(LoginWithEmail, LoginWithFacebook)(LoginForm);
