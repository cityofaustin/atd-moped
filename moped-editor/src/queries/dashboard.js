import { gql } from "@apollo/client";

export const USER_FOLLOWED_PROJECTS_QUERY = gql`
  query UserFollowedProjectsQuery($userId: Int) {
    moped_user_followed_projects(
      where: {
        user_id: { _eq: $userId }
        project: { is_deleted: { _neq: true } }
      }
    ) {
      project {
        project_id
        project_name
        current_phase
        current_status
        moped_proj_notes(
          where: { project_note_type: { _eq: 2 }, is_deleted: { _eq: false } }
          order_by: { date_created: desc }
        ) {
          added_by
          project_note_type
          status_id
          project_note
        }
      }
    }
  }
`;

export const USER_PERSONNEL_PROJECTS_QUERY = gql`
  query UserPersonnelProjectsQuery($userId: Int) {
    moped_proj_personnel(
      where: {
        user_id: { _eq: $userId }
        status_id: { _neq: 0 }
        project: { is_deleted: { _eq: false } }
      }
    ) {
      project_id
      user_id
      project {
        project_id
        project_name
        current_phase
        current_status
        moped_proj_notes(
          where: { project_note_type: { _eq: 2 }, is_deleted: { _eq: false } }
          order_by: { date_created: desc }
        ) {
          added_by
          project_note_type
          status_id
          project_note
        }
      }
    }
  }
`;
