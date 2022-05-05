import { gql } from "@apollo/client";

export const USER_FOLLOWED_PROJECTS_QUERY = gql`
  query UserFollowedProjectsQuery($userId: Int) {
    moped_user_followed_projects(where: { user_id: { _eq: $userId } }) {
      project {
        project_id
        project_name
        current_status
        moped_proj_notes(where: { project_note_type: { _eq: 2 } }) {
          added_by
          project_note_type
          status_id
          project_note
        }
      }
    }
  }
`;
