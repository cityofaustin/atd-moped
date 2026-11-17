import { gql } from "@apollo/client";

export const WORKGROUPS_QUERY = gql`
  query GetWorkgroups {
    moped_workgroup(
      order_by: { workgroup_name: asc }
      where: { is_deleted: { _eq: false } }
    ) {
      workgroup_id
      workgroup_name
    }
  }
`;
