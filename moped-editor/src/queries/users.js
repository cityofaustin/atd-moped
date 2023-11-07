import { gql } from "@apollo/client";

/**
 * This mutation calls the `set_last_seen` function, which updates the
 * users' last_seen_date based on the user ID session variable
 */
export const LAST_SEEN_MUTATION = gql`
  mutation SetLastSeenDate {
    set_last_seen_date {
      user_id
    }
  }
`;
