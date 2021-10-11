import { gql } from "@apollo/client";

export const FUNDING_QUERY = gql`
  query ProjectFunding($projectId: Int) {
    moped_proj_funding(where: { project_id: { _eq: $projectId } }) {
      added_by
      date_added
      fund_dept_unit
      funding_amount
      funding_description
      funding_program_id
      funding_source_id
      funding_status_id
    }
  }
`;
