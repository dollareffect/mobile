import React, { PureComponent } from 'react';
import { Alert } from 'react-native';
import ViewPropTypes from 'ViewPropTypes';
import PropTypes from 'prop-types';
import { SocialIcon } from 'react-native-elements';
import * as facebook from '../../lib/facebook';
import styles from './styles';

type Props = {
  style?: mixed,
  disabled?: boolean,
  loading?: boolean,
  onLoginSuccess: string => void,
};

export default class FacebookLoginButton extends PureComponent<Props> {
  static propTypes = {
    style: ViewPropTypes.style,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    onLoginSuccess: PropTypes.func,
  };

  constructor() {
    super();
    this.state = {
      loading: false,
    };
  }

  onPressFacebookButton = () => {
    this.setState({
      loading: true,
    });

    facebook
      .login()
      .then(async () => {
        const facebookAccessToken = await facebook.currentAccessToken();
        this.props.onLoginSuccess(facebookAccessToken);
        this.setState({
          loading: false,
        });
      })
      .catch(error => {
        Alert.alert('Error', error.message, [{ text: 'OK' }], {
          cancelable: false,
        });
        this.setState({
          loading: false,
        });
      });
  };

  render() {
    return (
      <SocialIcon
        style={[styles.facebookButton, this.props.style]}
        title="Sign In With Facebook"
        button
        type="facebook"
        loading={this.state.loading || this.props.loading}
        onPress={this.onPressFacebookButton}
        onLongPress={this.onPressFacebookButton}
        disabled={this.state.loading || this.props.disabled}
        raised={false}
      />
    );
  }
}
