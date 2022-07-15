import { gql } from "@apollo/client";

export const TIMELINE_LOOKUPS_QUERY = gql`
  query TimelineQuery {
    moped_phases(order_by: { phase_order: asc }) {
      phase_id
      phase_name
      phase_description
      phase_order
      moped_subphases(order_by: { subphase_order: asc }) {
        subphase_id
        related_phase_id
        subphase_description
        subphase_name
        subphase_order
      }
    }
    moped_milestones {
      milestone_id
      milestone_name
      milestone_description
      milestone_order
      related_phase_id
    }
  }
`;
