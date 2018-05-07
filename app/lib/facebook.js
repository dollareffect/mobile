import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';

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

export const fetchProfile = (fields = 'id,name,email') =>
  new Promise((resolve, reject) => {
    const profileInfoCallback = (error, profileInfo) => {
      if (error) reject(error);

      resolve(profileInfo);
    };

    const profileInfoRequest = new GraphRequest(
      '/me',
      {
        parameters: {
          fields: {
            string: fields,
          },
        },
      },
      profileInfoCallback,
    );

    new GraphRequestManager().addRequest(profileInfoRequest).start();
  });

export const currentAccessToken = async () => {
  const token = await AccessToken.getCurrentAccessToken();
  return token.accessToken;
};
