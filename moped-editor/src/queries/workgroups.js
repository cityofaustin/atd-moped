import { gql } from "@apollo/client";

export const WORKGROUPS_QUERY = gql`
  query GetWorkgroups {
    moped_workgroup(order_by: {workgroup_name: asc}) {
      workgroup_id
      workgroup_name
    }
  }
`;
