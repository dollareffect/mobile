import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: 48,
    flexDirection: 'row',
    paddingRight: 16,
    paddingLeft: 16,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 16,
    padding: 16,
  },
  imageStyle: {
    padding: 8,
  },
});
