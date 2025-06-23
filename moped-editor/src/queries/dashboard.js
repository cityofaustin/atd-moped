import { gql } from "@apollo/client";

export const DASHBOARD_QUERY = gql`
  query DashboardQuery($userId: Int) {
    moped_proj_personnel(
      where: {
        user_id: { _eq: $userId }
        is_deleted: { _eq: false }
        project: { is_deleted: { _eq: false } }
      }
    ) {
      project_id
      user_id
      project {
        project_id
        ecapris_subproject_id
        project_name
        project_name_full
        moped_proj_phases(where: { is_current_phase: { _eq: true } }) {
          moped_phase {
            phase_name
            phase_key
            phase_id
          }
        }
        moped_proj_milestones(where: { is_deleted: { _eq: false } }) {
          project_id
          completed
        }
        project_list_view {
          project_status_update
        }
      }
    }
    moped_user_followed_projects(
      where: {
        user_id: { _eq: $userId }
        project: { is_deleted: { _eq: false } }
      }
    ) {
      project {
        project_id
        ecapris_subproject_id
        project_name
        project_name_full
        moped_proj_phases(where: { is_current_phase: { _eq: true } }) {
          moped_phase {
            phase_name
            phase_key
            phase_id
          }
        }
        moped_proj_milestones(where: { is_deleted: { _eq: false } }) {
          project_id
          completed
        }
        project_list_view {
          project_status_update
        }
      }
    }
    moped_note_types {
      id
      name
      slug
    }
  }
`;
