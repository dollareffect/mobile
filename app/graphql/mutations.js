import gql from 'graphql-tag';

export const LoginWithEmailMutation = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export const LoginWithFacebookMutation = gql`
  mutation($facebookAccessToken: String!) {
    loginWithFacebook(facebookAccessToken: $facebookAccessToken) {
      token
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
    signup(
      email: $email
      username: $username
      name: $name
      password: $password
    ) {
      token
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
    signupWithFacebook(
      email: $email
      username: $username
      name: $name
      facebookAccessToken: $facebookAccessToken
    ) {
      token
    }
  }
`;
