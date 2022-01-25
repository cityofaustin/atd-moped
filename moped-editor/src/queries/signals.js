import { gql } from "@apollo/client";

// Status ID 6 is archived (soft deleted)
// Status ID 3 is cancelled

export const SIGNAL_PROJECTS_QUERY = gql`
  query SignalProjectsQuery {
    moped_project(
      where: {
        _or: [
          {
            moped_proj_components: {
              moped_components: { component_name: { _ilike: "signal" } }
            }
            status_id: { _is_null: true }
          }
          {
            moped_proj_components: {
              moped_components: { component_name: { _ilike: "signal" } }
            }
            status_id: { _neq: 6 }
          }
          {
            moped_proj_components: {
              moped_components: { component_name: { _ilike: "signal" } }
            }
            status_id: { _neq: 3 }
          }
        ]
      }
      order_by: {updated_at: desc_nulls_last}
    ) {
      project_id
      project_name
      updated_at
      contractor
      purchase_order_number
      project_sponsor
      task_order
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
      moped_proj_features(where: { status_id: { _eq: 1 } }) {
        feature_id
        location
      }
      moped_proj_funding (where: {funding_status_id : { _neq: 0 } }) {
        moped_fund_source {
          funding_source_name
        }
      }
      moped_project_types(where: { status_id: { _eq: 1 } }) {
        id
        status_id
        moped_type {
          type_name
          type_id
        }
      }
      moped_proj_personnel(where: { status_id: { _eq: 1 } }) {
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
    moped_types {
      type_id
      type_name
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
