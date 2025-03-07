import { gql } from "@apollo/client";

export const USER_SAVED_VIEWS_QUERY = gql`
    query userSavedViews($userId: Int) {
        moped_user_saved_views(
            where: { created_by_user_id: { _eq: $userId }, is_deleted: { _eq: false } }
        ) {
            id
            description
            url
            query_filters
            created_by_user_id
            updated_by_user_id
            created_at
            updated_at
            is_deleted
        }
    }
`;