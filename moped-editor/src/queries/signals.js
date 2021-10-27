import { gql } from "@apollo/client";

export const SIGNAL_PROJECTS_QUERY = gql`
  query SignalProjectsQuery {
    moped_project(where: {moped_proj_components: {moped_components: {component_name: {_ilike: "signal"}}}}) {
      current_phase
      project_id
      project_name
      updated_at
      contractor
      moped_proj_notes(
        where: { project_note_type: { _eq: 2 } }
        order_by: { date_created: desc }
      ) {
        project_note_id
        project_note
      }
      moped_proj_phases {
        phase_name
        phase_start
      }
      moped_proj_features {
        feature_id
        location
      }
    }
  }
`;

export const UPDATE_SIGNAL_PROJECT = gql`
  mutation SignalProjectMutation(
    $project_id: Int!
    $contractor: String
  ) {
    update_moped_project_by_pk(
      pk_columns: { project_id: $project_id }
      _set: {
        contractor: $contractor
      }
    ) {
      project_id
    }
  }
`;
