import { persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducers from './User';

const config = {
  key: 'primary',
  storage,
};

export const rootReducer = persistCombineReducers(config, {
  user: userReducers,
});

export default rootReducer;
