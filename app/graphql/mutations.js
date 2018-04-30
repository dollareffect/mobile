import gql from 'graphql-tag';

export const LoginWithEmailMutation = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      refreshToken
      user {
        id
      }
    }
  }
`;

export const LoginWithFacebookMutation = gql`
  mutation($facebookAccessToken: String!) {
    loginWithFacebook(facebookAccessToken: $facebookAccessToken) {
      token
      refreshToken
      user {
        id
      }
    }
  }
`;

export const SignUpWithEmailMutation = gql`
  mutation(
    $email: String!
    $username: String!
    $name: String!
    $password: String!
  ) {
    signUp(
      email: $email
      username: $username
      name: $name
      password: $password
    ) {
      token
      refreshToken
      user {
        id
      }
    }
  }
`;

export const SignUpWithFacebookMutation = gql`
  mutation(
    $email: String!
    $username: String!
    $name: String!
    $facebookAccessToken: String!
  ) {
    signUpWithFacebook(
      email: $email
      username: $username
      name: $name
      facebookAccessToken: $facebookAccessToken
    ) {
      token
      refreshToken
      user {
        id
      }
    }
  }
`;
