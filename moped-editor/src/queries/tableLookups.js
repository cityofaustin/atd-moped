import { gql } from "@apollo/client";

export const TABLE_LOOKUPS_QUERY = gql`
  query TableLookupQuery {
    moped_phases(order_by: { phase_order: asc }) {
      phase_id
      phase_key
      phase_name
      phase_name_simple
      phase_description
      phase_order
      moped_subphases {
        subphase_id
        subphase_description
        subphase_name
      }
    }
    moped_milestones(
      where: { is_deleted: { _eq: false } }
      order_by: { milestone_id: asc }
    ) {
      milestone_id
      milestone_name
      milestone_description
      moped_phase {
        phase_name
      }
    }
    moped_components(
      where: { is_deleted: { _eq: false } }
      order_by: [{ component_name: asc }, { component_subtype: asc }]
    ) {
      component_name
      component_subtype
      component_id
      line_representation
      moped_components_subcomponents(
        order_by: { moped_subcomponent: { subcomponent_name: asc } }
      ) {
        moped_subcomponent {
          subcomponent_id
          subcomponent_name
        }
      }
      moped_component_work_types(order_by: { moped_work_type: { name: asc } }) {
        moped_work_type {
          id
          name
        }
      }
    }
    moped_tags(where: { is_deleted: { _eq: false } }, order_by: { name: asc }) {
      id
      name
      slug
      type
    }
    moped_entity(
      order_by: { entity_name: asc }
      where: { is_deleted: { _eq: false } }
    ) {
      entity_id
      entity_name
    }
    moped_component_tags(
      where: { is_deleted: { _eq: false } }
      order_by: { type: asc, name: asc }
    ) {
      id
      type
      name
      slug
    }
    moped_project_roles(
      where: { active_role: { _eq: true } }
      order_by: { role_order: asc }
    ) {
      project_role_id
      project_role_name
      project_role_description
    }
    moped_fund_status(
      # Filter out the "Archived" status
      where: { funding_status_id: { _neq: 0 } }
    ) {
      funding_status_name
      funding_status_id
      funding_status_description
    }
  }
`;
