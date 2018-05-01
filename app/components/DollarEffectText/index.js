import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import ViewPropTypes from 'ViewPropTypes';
import styles from './styles';

type Props = {
  containerStyle: mixed,
};

export default class DollarEffectText extends PureComponent<Props> {
  static propTypes = {
    containerStyle: ViewPropTypes.style,
  };

  render() {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <Text style={[styles.text, styles.dollar]}>DOLLAR</Text>
        <Text style={[styles.text, styles.effect]}>EFFECT</Text>
      </View>
    );
  }
}
