import { gql } from "@apollo/client";

/* Not wrapped with gql so we can pass as a string to fetch API in initializeUserDBObject  */
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
            moped_workgroup {
              workgroup_name
            }
        }
    }
`;

export const ACCOUNT_USER_PROFILE_GET = gql(ACCOUNT_USER_PROFILE_GET_PLAIN);
