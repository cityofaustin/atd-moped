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

export const UPDATE_PROJECT_PHASES_MUTATION = gql`
  mutation ProjectPhasesMutation(
    $is_current_phase: Boolean
    $phase_start: date = null
    $phase_end: date = null
    $project_phase_id: Int!
    $phase_name: String!
  ) {
    update_moped_proj_phases_by_pk(
      pk_columns: { project_phase_id: $project_phase_id }
      _set: {
        is_current_phase: $is_current_phase
        phase_start: $phase_start
        phase_end: $phase_end
        phase_name: $phase_name
      }
    ) {
      project_id
      project_phase_id
      phase_name
      phase_start
      phase_end
      is_current_phase
    }
  }
`;

export const DELETE_PROJECT_PHASE = gql`
  mutation DeleteProjectPhase($project_phase_id: Int!) {
    delete_moped_proj_phases_by_pk(project_phase_id: $project_phase_id) {
      project_phase_id
    }
  }
`;

export const ADD_PROJECT_PHASE = gql`
  mutation AddProjectPhase($objects: [moped_proj_phases_insert_input!]!) {
    insert_moped_proj_phases(objects: $objects) {
      returning {
        phase_name
        phase_start
        phase_end
        project_phase_id
        is_current_phase
        project_id
        completion_percentage
        completed
      }
    }
  }
`;
