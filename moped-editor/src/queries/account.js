import { gql } from "@apollo/client";

export const ACCOUNT_USER_PROFILE_GET_PLAIN = `
    query GetUserProfile($userId: Int!) {
        moped_users(where: {user_id: {_eq: $userId}}) {
            user_id
            cognito_user_id
            email
            first_name
            last_name
            is_coa_staff
            title
            picture
            workgroup
        }
    }
`;

export const ACCOUNT_USER_PROFILE_GET = gql(ACCOUNT_USER_PROFILE_GET_PLAIN);

export const ACCOUNT_USER_PICTURE_UPDATE = gql`
  mutation UpdateUserPicture($userId: Int!, $picture: String!) {
    update_moped_users(
      _set: { picture: $picture }
      where: { user_id: { _eq: $userId } }
    ) {
      affected_rows
    }
  }
`;

export const ACCOUNT_USER_PICTURE_DELETE = gql`
  mutation DeleteUserPicture($userId: Int!) {
    update_moped_users(
      _set: { picture: null }
      where: { user_id: { _eq: $userId } }
    ) {
      affected_rows
    }
  }
`;
