import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import styles from './styles';

class SingleLineItem extends Component {
  render() {
    const { icon, text, onPress } = this.props;
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.container}>
          <Image source={icon} />
          <Text style={styles.textStyle}>{text}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default SingleLineItem;
