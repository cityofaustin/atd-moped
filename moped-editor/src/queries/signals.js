import { gql } from "@apollo/client";

export const SIGNAL_PROJECTS_QUERY = gql`
  query SignalProjectsQuery {
    moped_project(
      where: {
        is_deleted: { _eq: false }
        _or: [
          {
            moped_proj_components: {
              moped_components: { component_name: { _ilike: "signal" } }
              is_deleted: { _eq: false }
            }
          }
          {
            moped_proj_components: {
              moped_components: { component_name: { _ilike: "signal" } }
              is_deleted: { _eq: false }
            }
          }
        ]
      }
      order_by: { updated_at: desc_nulls_last }
    ) {
      project_id
      project_name
      updated_at
      project_sponsor
      task_order
      moped_proj_notes(
        where: { project_note_type: { _eq: 2 }, is_deleted: { _eq: false } }
        order_by: { date_created: desc }
      ) {
        project_note_id
        project_note
      }
      moped_proj_phases {
        phase_id
        is_current_phase
        phase_start
        phase_end
        moped_phase {
          phase_name
        }
      }
      moped_proj_components(where: { is_deleted: { _eq: false } }) {
        moped_proj_features(where: { is_deleted: { _eq: false } }) {
          feature_id
          feature
        }
      }
      moped_proj_funding(where: { is_deleted: { _eq: false } }) {
        moped_fund_source {
          funding_source_name
        }
      }
      moped_project_types(where: { is_deleted: { _eq: false } }) {
        id
        moped_type {
          type_name
          type_id
        }
      }
      moped_proj_personnel(where: { is_deleted: { _eq: false } }) {
        moped_proj_personnel_roles {
          project_role_id
        }
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
  mutation SignalProjectMutation($project_id: Int!, $entity_id: Int) {
    update_moped_project_by_pk(
      pk_columns: { project_id: $project_id }
      _set: { project_sponsor: $entity_id }
    ) {
      project_id
    }
  }
`;
