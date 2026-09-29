import { graphql } from "src/gql";

export const GET_ACCOUNT_USER_PROFILE = graphql(`
  query GetUserProfile($userId: Int!) {
    moped_users(where: { user_id: { _eq: $userId } }) {
      user_id
      cognito_user_id
      email
      first_name
      last_name
      is_coa_staff
      title
      moped_workgroup {
        workgroup_name
      }
    }
  }
`);
