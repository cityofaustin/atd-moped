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
      last_seen_date
      moped_workgroup {
        workgroup_id
        workgroup_name
      }
      is_user_group_member
      note
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
      is_user_group_member
      note
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
      moped_workgroup {
        workgroup_id
        workgroup_name
      }
      email
      roles
      is_deleted
      is_user_group_member
      note
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
      moped_workgroup {
        workgroup_id
        workgroup_name
      }
      email
      roles
      is_deleted
      is_user_group_member
      note
    }
  }
`;

/**
 * This mutation insers a new moped_user_events row which will in turn trigger an
 * updates to users' last_seen_date based on the user ID session variable
 */
export const INSERT_USER_EVENT = gql`
  mutation InsertUserEvent($event_name: String!) {
    insert_moped_user_events(objects: { event_name: $event_name }) {
      affected_rows
    }
  }
`;
