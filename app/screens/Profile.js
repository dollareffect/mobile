import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, Dimensions, Alert } from 'react-native';
import SingleLineItem from '../components/SingleLineItem';

type Props = {};
export default class ProfileScreen extends Component<Props> {
  static navigationOptions = () => ({ title: 'Settings' });

  showAlert = () => {
    Alert.alert('Alert', 'Message');
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <Image
            style={styles.imageStyle}
            source={{
              uri: 'https://ndc-london.com/images/speaker/jon_Skeet.png',
            }}
          />
          <Text style={styles.textStyle}>Jon Skeet</Text>
        </View>
        <SingleLineItem
          text="Privacy Policy"
          icon={require('../images/ic_location.png')}
          onPress={this.showAlert}
        />
        <SingleLineItem
          text="Terms and Conditions"
          icon={require('../images/ic_location.png')}
        />
        <SingleLineItem
          text="Help and Support"
          icon={require('../images/ic_location.png')}
        />
        <SingleLineItem
          text="About"
          icon={require('../images/ic_location.png')}
        />
        <SingleLineItem
          text="Logout"
          icon={require('../images/ic_location.png')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  profileContainer: {
    width: Dimensions.get('window').width,
    height: 96,
    flexDirection: 'row',
    paddingRight: 16,
    paddingLeft: 16,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 24,
  },
  imageStyle: {
    height: 72,
    width: 72,
    borderRadius: 36,
  },
  textStyle: {
    fontSize: 18,
    padding: 16,
  },
});
