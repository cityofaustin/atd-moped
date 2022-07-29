import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUser($userId: Int) {
    moped_users(where: { user_id: { _eq: $userId } }) {
      date_added
      first_name
      is_coa_staff
      last_name
      staff_uuid
      title
      user_id
      workgroup
      workgroup_id
      cognito_user_id
      email
      roles
      is_deleted
    }
  }
`;
