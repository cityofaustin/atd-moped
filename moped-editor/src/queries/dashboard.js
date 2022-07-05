import { gql } from "@apollo/client";

export const DASHBOARD_QUERY = gql`
  query DashboardQuery($userId: Int) {
    moped_proj_personnel(
      where: {
        user_id: { _eq: $userId }
        is_deleted: { _eq: false }
        project: { is_deleted: { _neq: true } }
      }
    ) {
      project_id
      user_id
      project {
        project_id
        project_name
        current_phase
        current_status
        moped_proj_milestones(where: { is_deleted: { _neq: true } }) {
          project_id
          completed
        }
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
        moped_proj_milestones(where: { is_deleted: { _neq: true } }) {
          project_id
          completed
        }
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
