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
    moped_fund_sources {
      funding_source_id
      funding_source_name
      funding_source_category
    }
    moped_fund_programs {
      funding_program_id
      funding_program_name
    }
    moped_fund_status {
      funding_status_id
      funding_status_name
    }
  }
`;
