import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import styles from './styles';

class AvatarSingleLineItem extends Component {
  render() {
    const { avatar, text } = this.props;
    return (
      <View style={styles.container}>
        <Image style={styles.imageStyle} source={avatar} />
        <Text style={styles.textStyle}>{text}</Text>
      </View>
    );
  }
}

export default AvatarSingleLineItem;
