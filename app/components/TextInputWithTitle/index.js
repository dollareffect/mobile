import React, { PureComponent } from 'react';
import { View, Text, TextInput } from 'react-native';
import ViewPropTypes from 'ViewPropTypes';
import styles from './styles';

type Props = {
  containerStyle: mixed,
  textInputStyle: mixed,
  titleStyle: mixed,
  textInputProps: mixed,
};

export default class TextInputWithTitle extends PureComponent<Props> {
  static propTypes = {
    containerStyle: ViewPropTypes.style,
    textInputStyle: ViewPropTypes.style,
    titleStyle: ViewPropTypes.style,
  };

  render() {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <Text style={[styles.textInputTitle, this.props.titleStyle]}>
          Email
        </Text>
        <TextInput
          style={[styles.textInput, this.props.textInputStyle]}
          underlineColorAndroid="rgba(0,0,0,0)"
          {...this.props.textInputProps}
        />
      </View>
    );
  }
}
