import React, { Component } from 'react';
import {
  ImageBackground,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
} from 'react-native';
import { Button } from 'react-native-elements';
import { graphql, compose } from 'react-apollo';
import _ from 'lodash';
import * as validator from 'validator';
import ViewPropTypes from 'ViewPropTypes';
import PropTypes from 'prop-types';
import styles from './styles';
import TextInputWithTitle from '../TextInputWithTitle';
import { SignUpWithEmailMutation, SignUpWithFacebookMutation } from '../../graphql/mutations';
import { saveToken } from '../../lib/authStorage';
import * as facebook from '../../lib/facebook';

type Props = {
  containerStyle: mixed,
  signUpDidSuccess: () => void,
};
class SignUpForm extends Component<Props> {
  static propTypes = {
    containerStyle: ViewPropTypes.style,
    signUpDidSuccess: PropTypes.func,
  };

  constructor(props) {
    super(props);
    let name = '';
    let email = '';
    let isFacebookSignUp = false;

    const { fbProfile } = props;
    if (fbProfile) {
      ({ name, email } = fbProfile);
      isFacebookSignUp = true;
    }

    this.state = {
      name,
      username: '',
      email,
      password: '',
      isFacebookSignUp,
      isCreatingAccount: false,
    };
  }

  onChangeNameText = text => this.setState({ name: text });

  onChangeUsernameText = text => {
    if (validator.isAlphanumeric(text) || validator.isEmpty(text)) {
      this.setState({ username: text });
    }
  };

  onChangeEmailText = text => this.setState({ email: text });

  onChangePasswordText = text => this.setState({ password: text });

  onPressCreateAccountButton = () => {
    Keyboard.dismiss();
    this.validateForm()
      .then(async () => {
        this.setState({
          isCreatingAccount: true,
        });

        const variables = {
          email: this.state.email,
          name: this.state.name,
          username: this.state.username,
        };

        if (this.state.isFacebookSignUp) {
          const facebookAccessToken = await facebook.currentAccessToken();
          return this.props
            .signUpWithFacebook({
              variables: {
                facebookAccessToken,
                ...variables,
              },
            })
            .then(result => result.data.signUpWithFacebook);
        }

        return this.props
          .signUpWithEmail({
            variables: {
              password: this.state.password,
              ...variables,
            },
          })
          .then(async result => result.data.signUp);
      })
      .then(async result => {
        await saveToken(result.token, result.refreshToken, result.user.id);
        // success
        this.props.signUpDidSuccess();
      })
      .catch(error => {
        const graphQLError = _.head(error.graphQLErrors);
        if (graphQLError) {
          Alert.alert('Error', graphQLError.message, [{ text: 'OK' }], {
            cancelable: false,
          });
        } else {
          Alert.alert('Error', error.message, [{ text: 'OK' }], {
            cancelable: false,
          });
        }
        this.setState({
          isCreatingAccount: false,
        });
      });
  };

  shouldEnableCreateAccountButton = () => {
    if (this.state.isCreatingAccount) return false;
    if (this.state.name.length === 0) return false;
    if (this.state.username.length === 0) return false;
    if (this.state.email.length === 0) return false;
    if (this.state.password.length === 0 && !this.state.isFacebookSignUp) return false;

    return true;
  };

  validateForm = () =>
    new Promise((resolve, reject) => {
      if (!/^[ a-z]+$/i.test(this.state.name)) return reject(Error('Name must be alpha.'));

      if (!validator.isAlphanumeric(this.state.username))
        return reject(Error('Username must be alphanumeric.'));

      if (this.state.username.length < 3)
        return reject(Error('Username must be 3 or more characters.'));

      if (!validator.isEmail(this.state.email)) return reject(Error('Email is invalid.'));

      if (this.state.password.length < 3 && !this.state.isFacebookSignUp)
        return reject(Error('Password must be 3 or more characters.'));

      return resolve();
    });

  render() {
    return (
      <KeyboardAvoidingView
        style={[styles.container, this.props.containerStyle]}
        behavior="position"
        enabled>
        <ScrollView>
          <ImageBackground
            source={require('../../images/gradient-header.png')}
            style={styles.header}>
            <Text style={styles.title}>Be part of the Dollar Effect.</Text>
            <Text style={styles.subtitle}>Create an account using your Email.</Text>
          </ImageBackground>
          <View style={styles.formContainer}>
            <TextInputWithTitle
              title="NAME"
              containerStyle={[styles.textInputContainer]}
              textInputProps={{
                value: this.state.name,
                onChangeText: this.onChangeNameText,
              }}
            />

            <TextInputWithTitle
              title="USERNAME"
              containerStyle={[styles.textInputContainer]}
              textInputProps={{
                value: this.state.username,
                onChangeText: this.onChangeUsernameText,
                autoCapitalize: 'none',
              }}
            />

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

            {!this.state.isFacebookSignUp && (
              <TextInputWithTitle
                title="PASSWORD"
                containerStyle={[styles.textInputContainer]}
                textInputProps={{
                  value: this.state.password,
                  onChangeText: this.onChangePasswordText,
                  secureTextEntry: true,
                }}
              />
            )}

            <Button
              containerViewStyle={styles.signUpButtonContainer}
              buttonStyle={styles.signUpButton}
              backgroundColor="#209CFF"
              rounded
              title={this.state.isCreatingAccount ? '' : 'CREATE ACCOUNT'}
              loading={this.state.isCreatingAccount}
              onPress={this.onPressCreateAccountButton}
              disabled={!this.shouldEnableCreateAccountButton()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const SignUpWithEmail = graphql(SignUpWithEmailMutation, {
  name: 'signUpWithEmail',
});

const SignUpWithFacebook = graphql(SignUpWithFacebookMutation, {
  name: 'signUpWithFacebook',
});

export default compose(SignUpWithEmail, SignUpWithFacebook)(SignUpForm);
