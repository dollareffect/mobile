import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: 64,
    flexDirection: 'row',
    paddingRight: 16,
    paddingLeft: 16,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  imageStyle: {
    height: 48,
    width: 48,
    borderRadius: 24,
  },
  textStyle: {
    fontSize: 16,
    padding: 16,
  },
});
