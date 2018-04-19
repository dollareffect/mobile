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
import { Button } from 'react-native-elements';
import { graphql, compose } from 'react-apollo';
import _ from 'lodash';
import * as validator from 'validator';
import {
  SignUpWithEmailMutation,
  SignUpWithFacebookMutation,
} from '../graphql/mutations';
import { USER_TOKEN_KEY } from '../config/constants';
import * as facebook from '../lib/facebook';

type Props = {};
class SignUpScreen extends Component<Props> {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    let name = '';
    let email = '';
    let isFacebookSignUp = false;

    if (props.navigation.state.params != null) {
      const { fbProfile } = props.navigation.state.params;
      if (fbProfile) {
        ({ name, email } = fbProfile);
        isFacebookSignUp = true;
      }
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

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  saveToken = async token => {
    // save to async storage
    await AsyncStorage.setItem(USER_TOKEN_KEY, token);
  };

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
            .then(result => result.data.signUpWithFacebook.token);
        }

        return this.props
          .signUpWithEmail({
            variables: {
              password: this.state.password,
              ...variables,
            },
          })
          .then(result => result.data.signUp.token);
      })
      .then(this.saveToken)
      .then(() => {
        // success
        const { navigate } = this.props.navigation;
        navigate('App');
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
      })
      .finally(() => {
        if (this.mounted)
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
    if (this.state.password.length === 0 && !this.state.isFacebookSignUp)
      return false;

    return true;
  };

  validateForm = () =>
    new Promise((resolve, reject) => {
      if (!/^[ a-z]+$/i.test(this.state.name))
        return reject(Error('Name must be alpha.'));

      if (!validator.isAlphanumeric(this.state.username))
        return reject(Error('Username must be alphanumeric.'));

      if (this.state.username.length < 3)
        return reject(Error('Username must be 3 or more characters.'));

      if (!validator.isEmail(this.state.email))
        return reject(Error('Email is invalid.'));

      if (this.state.password.length < 3)
        return reject(Error('Password must be 3 or more characters.'));

      return resolve();
    });

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Text style={styles.title}>SignUp</Text>
        <View style={styles.textInputContainer}>
          <Text style={styles.textInputTitle}>Name</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={this.onChangeNameText}
            value={this.state.name}
            underlineColorAndroid="rgba(0,0,0,0)"
            maxLength={20}
          />
        </View>

        <View style={styles.textInputContainer}>
          <Text style={styles.textInputTitle}>Username</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={this.onChangeUsernameText}
            value={this.state.username}
            autoCapitalize="none"
            underlineColorAndroid="rgba(0,0,0,0)"
            maxLength={15}
          />
        </View>

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

        {!this.state.isFacebookSignUp && (
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
        )}

        <Button
          containerViewStyle={styles.signUpButtonContainer}
          buttonStyle={styles.signUpButton}
          rounded
          title={this.state.isCreatingAccount ? '' : 'Create Account'}
          loading={this.state.isCreatingAccount}
          onPress={this.onPressCreateAccountButton}
          disabled={!this.shouldEnableCreateAccountButton()}
        />
      </KeyboardAvoidingView>
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
  signUpButtonContainer: {
    marginTop: 40,
    marginLeft: 0,
    marginRight: 0,
  },
  signUpButton: {
    height: 50,
  },
});

const SignUpWithEmail = graphql(SignUpWithEmailMutation, {
  name: 'signUpWithEmail',
});

const SignUpWithFacebook = graphql(SignUpWithFacebookMutation, {
  name: 'signUpWithFacebook',
});

export default compose(SignUpWithEmail, SignUpWithFacebook)(SignUpScreen);
