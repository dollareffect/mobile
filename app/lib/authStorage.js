import moment from 'moment';
import { AsyncStorage } from 'react-native';
import {
  USER_TOKEN_KEY,
  USER_ID_KEY,
  USER_TOKEN_EXPIRATION_KEY,
  USER_REFRESH_TOKEN_KEY,
} from '../config/constants';

export const saveToken = async (token, refreshToken, userId) => {
  // save to async storage
  const tokenExpirationDate = moment().add('1', 'hours');

  return AsyncStorage.multiSet([
    [USER_TOKEN_KEY, token],
    [USER_ID_KEY, userId],
    [USER_REFRESH_TOKEN_KEY, refreshToken],
    [USER_TOKEN_EXPIRATION_KEY, tokenExpirationDate.format()],
  ]);
};

export const clearToken = () =>
  AsyncStorage.multiRemove([
    USER_TOKEN_KEY,
    USER_ID_KEY,
    USER_REFRESH_TOKEN_KEY,
    USER_TOKEN_EXPIRATION_KEY,
  ]);
