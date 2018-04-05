import { LoginManager, AccessToken } from 'react-native-fbsdk';

export const login = (permissions = ['email', 'public_profile']) =>
  new Promise((resolve, reject) => {
    LoginManager.logInWithReadPermissions(permissions).then(
      result => {
        if (!result.isCancelled) {
          resolve(result);
        } else {
          reject(Error('Facebook Login is Cancelled.'));
        }
      },
      error => reject(error),
    );
  });

export const currentAccessToken = async () => {
  const token = await AccessToken.getCurrentAccessToken();
  return token.accessToken;
};
