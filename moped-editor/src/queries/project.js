import { gql } from "apollo-boost";

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

export const TIMELINE_QUERY = gql`
  query TeamTimeline($projectId: Int) {
    moped_phases {
      phase_id
      phase_name
    }
    moped_proj_phases(where: { project_id: { _eq: $projectId } }) {
      phase_name
      project_phase_id
      is_current_phase
      project_id
      phase_start
      phase_end
    }
  }
`;
