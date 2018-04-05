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
    login(facebookAccessToken: $facebookAccessToken) {
      token
    }
  }
`;
