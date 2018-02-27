import createReducer from '../lib/createReducer';
import { SET_CURRENT_USER_ID } from '../actions/User';

const initialState = {
  currentUserId: null,
};

export default createReducer(initialState, {
  [SET_CURRENT_USER_ID](state = initialState, action) {
    return Object.assign({}, state, {
      currentUserId: action.userId,
    });
  },
});
