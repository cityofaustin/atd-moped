import { gql } from "@apollo/client";

export const TABLE_LOOKUPS_QUERY = gql`
  query TableLookupQuery {
    moped_phases(order_by: { phase_order: asc }) {
      phase_id
      phase_name
      phase_description
      phase_order
      moped_subphases(order_by: { subphase_order: asc }) {
        subphase_id
        subphase_description
        subphase_name
        subphase_order
      }
    }
    moped_milestones(order_by: { milestone_id: asc }) {
      milestone_id
      milestone_name
      milestone_description
      milestone_order
      moped_phase {
        phase_name
      }
    }
    moped_components {
      component_name
      component_subtype
      component_id
      line_representation
      moped_subcomponents {
        subcomponent_name
        subcomponent_id
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
