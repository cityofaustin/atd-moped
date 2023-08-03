import { gql } from "@apollo/client";

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    moped_users(order_by: { first_name: asc }) {
      last_name
      first_name
      user_id
      email
      roles
      title
      is_deleted
      moped_workgroup {
        workgroup_id
        workgroup_name
      }
    }
  }
`;

export const GET_USER = gql`
  query GetUser($userId: Int) {
    moped_users(where: { user_id: { _eq: $userId } }) {
      date_added
      first_name
      is_coa_staff
      last_name
      title
      user_id
      workgroup_id
      cognito_user_id
      email
      roles
      is_deleted
    }
  }
`;

export const ADD_NON_MOPED_USER = gql`
  mutation AddNonMopedUser($object: moped_users_insert_input!) {
    insert_moped_users_one(
      object: $object
      on_conflict: { constraint: moped_users_email_key }
    ) {
      date_added
      first_name
      last_name
      title
      user_id
      moped_workgroup {
        workgroup_id
        workgroup_name
      }
      email
      roles
      is_deleted
    }
  }
`;

export const UPDATE_NON_MOPED_USER = gql`
  mutation AddNonMopedUser($userId: Int!, $changes: moped_users_set_input) {
    update_moped_users_by_pk(pk_columns: { user_id: $userId }, _set: $changes) {
      date_added
      first_name
      last_name
      title
      user_id
      moped_workgroup {
        workgroup_id
        workgroup_name
      }
      email
      roles
      is_deleted
    }
  }
`;
