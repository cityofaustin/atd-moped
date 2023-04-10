import { gql } from "@apollo/client";

export const TABLE_LOOKUPS_QUERY = gql`
  query TableLookupQuery {
    moped_phases(order_by: { phase_order: asc }) {
      phase_id
      phase_name
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
      milestone_order
      moped_phase {
        phase_name
      }
    }
    moped_components(
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
    }
    moped_tags(where: { is_deleted: { _eq: false } }, order_by: { name: asc }) {
      id
      name
      slug
      type
    }
    moped_entity(order_by: { entity_name: asc }) {
      entity_id
      entity_name
    }
  }
`;
