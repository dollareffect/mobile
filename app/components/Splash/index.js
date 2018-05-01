import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ViewPropTypes from 'ViewPropTypes';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';
import { graphql, compose } from 'react-apollo';
import _ from 'lodash';
import { LoginWithFacebookMutation } from '../../graphql/mutations';
import DollarEffectText from '../DollarEffectText';
import FacebookLoginButton from '../FacebookLoginButton';
import { saveToken } from '../../lib/authStorage';
import * as facebook from '../../lib/facebook';
import styles from './styles';

type Props = {
  containerStyle: mixed,
  onPressSignUp: () => void,
  onLoginSuccess: () => void,
  onPressLoginWithEmail: () => void,
  onSignUpWithFacebook: Object => void,
};

class Splash extends PureComponent<Props> {
  static propTypes = {
    containerStyle: ViewPropTypes.style,
    onPressSignUp: PropTypes.func,
    onLoginSuccess: PropTypes.func,
    onPressLoginWithEmail: PropTypes.func,
    onSignUpWithFacebook: PropTypes.func,
  };

  constructor() {
    super();
    this.state = {
      isLogginInWithFacebook: false,
    };
  }

  onFacebookLoginSuccess = facebookAccessToken => {
    this.setState({
      isLogginInWithFacebook: true,
    });

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
        this.props.onLoginSuccess();
        this.setState({
          isLogginInWithFacebook: false,
        });
      })
      .catch(error => {
        this.setState({
          isLogginInWithFacebook: false,
        });
        console.log('error', error);
        // only how first graphql error
        const graphQLError = _.head(error.graphQLErrors);
        if (graphQLError != null) {
          if (_.startsWith(graphQLError.message, 'Could not find user')) {
            // means this is a new user then we should redirect to signup
            // fetch facebook profile to prefill signup form
            facebook.fetchProfile().then(fbProfile => {
              this.props.onSignUpWithFacebook(fbProfile);
            });
          }
        } else {
          throw Error(error.message);
        }
      });
  };
  render() {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <DollarEffectText containerStyle={styles.dollarEffectText} />
        <FacebookLoginButton
          onLoginSuccess={this.onFacebookLoginSuccess}
          loading={this.state.isLogginInWithFacebook}
        />

        <Button
          icon={{
            name: 'at',
            type: 'font-awesome',
            size: 18,
            style: {
              marginLeft: -25,
              marginRight: 25,
            },
          }}
          title="Log In With Email"
          rounded
          fontweight="medium"
          fontSize={14}
          containerViewStyle={styles.loginWithEmailButtonContainer}
          buttonStyle={styles.buttonStyle}
          onPress={this.props.onPressLoginWithEmail}
        />

        <TouchableOpacity
          style={styles.footerButton}
          onPress={this.props.onPressSignUp}>
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
    );
  }
}

const LoginWithFacebook = graphql(LoginWithFacebookMutation, {
  name: 'loginWithFacebook',
});

export default compose(LoginWithFacebook)(Splash);
