import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import SignUpForm from '../components/SignUpForm';

type Props = {};
export default class SignUpScreen extends Component<Props> {
  static navigationOptions = {};

  constructor(props) {
    super(props);
    let fbProfile = null;
    if (props.navigation.state.params != null) {
      ({ fbProfile } = props.navigation.state.params);
    }

    this.state = {
      fbProfile,
    };
  }

  signUpDidSuccess = () => {
    const { navigate } = this.props.navigation;
    navigate('App');
  };

  render() {
    return (
      <View style={styles.container}>
        <SignUpForm fbProfile={this.state.fbProfile} signUpDidSuccess={this.signUpDidSuccess} />
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
