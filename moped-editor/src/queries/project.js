import { gql } from "@apollo/client";

export const PROJECT_NAME = gql`
  query ProjectName($projectId: Int) {
    moped_project(where: { project_id: { _eq: $projectId } }) {
      project_name
    }
  }
`;

export const SUMMARY_QUERY = gql`
  query ProjectSummary($projectId: Int) {
    moped_project(where: { project_id: { _eq: $projectId } }) {
      project_name
      project_description
      start_date
      current_phase
      current_status
      capitally_funded
      eCapris_id
      fiscal_year
      project_priority
      project_extent_ids
      project_extent_geojson
    }
  }
`;

export const TEAM_QUERY = gql`
  query TeamSummary($projectId: Int) {
    moped_proj_personnel(where: { project_id: { _eq: $projectId } }) {
      first_name
      last_name
      role_name
      notes
    }
  }
`;

export const PROJECT_ACTIVITY_LOG = gql`
  query getMopedProjectChanges($projectId: Int!) {
    moped_activity_log(where: {record_project_id: {_eq: $projectId}}) {
      activity_id
      created_at
      record_project_id
      record_type
      description
      moped_user {
        first_name
        last_name
        user_id
      }
    }
  }
`
