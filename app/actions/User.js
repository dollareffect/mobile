export const SET_CURRENT_USER_ID = 'SET_CURRENT_USER_ID';

export function setCurrentUserId(userId) {
  return dispatch =>
    dispatch({
      type: SET_CURRENT_USER_ID,
      userId,
    });
}
