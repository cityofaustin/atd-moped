import { gql } from "@apollo/client";

export const SIGNAL_PROJECTS_QUERY = gql`
  query SignalProjectsQuery {
    moped_project(where: {moped_proj_components: {moped_components: {component_name: {_ilike: "signal"}}}}) {
      project_id
      project_name
      updated_at
      contractor
      purchase_order_number
      project_sponsor
      moped_proj_notes(
        where: { project_note_type: { _eq: 2 } }
        order_by: { date_created: desc }
      ) {
        project_note_id
        project_note
      }
      moped_proj_phases {
        phase_name
        is_current_phase
        phase_start
        phase_end
      }
      moped_proj_features {
        feature_id
        location
      }
      moped_proj_funding {
        moped_fund_source {
          funding_source_name
        }
      }
      moped_project_types {
        moped_type {
          type_name
        }
      }
      moped_proj_personnel(where: {status_id: {_eq: 1}}) {
        role_id
        moped_user {
          first_name
          last_name
        }
      }
    }
    moped_entity {
      entity_id
      entity_name
    }
  }
`;

export const UPDATE_SIGNAL_PROJECT = gql`
  mutation SignalProjectMutation(
    $project_id: Int!
    $contractor: String
    $purchase_order_number: String
    $entity_id: Int
  ) {
    update_moped_project_by_pk(
      pk_columns: { project_id: $project_id }
      _set: {
        contractor: $contractor
        purchase_order_number: $purchase_order_number
        project_sponsor: $entity_id
      }
    ) {
      project_id
    }
  }
`;
