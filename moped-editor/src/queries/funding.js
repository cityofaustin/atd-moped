import { gql } from "@apollo/client";

export const FUNDING_QUERY = gql`
  query ProjectFunding($projectId: Int) {
    moped_proj_funding(
      where: { project_id: { _eq: $projectId }, funding_status_id: { _gt: 0 } }
    ) {
      proj_funding_id
      added_by
      date_added
      fund_dept_unit
      funding_amount
      funding_description
      funding_program_id
      funding_source_id
      funding_status_id
    }
    moped_project(where: { project_id: { _eq: $projectId } }) {
      ecapris_subproject_id
      task_order
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
    moped_fund_status(where: { funding_status_id: { _neq: 0 } }) {
      funding_status_id
      funding_status_name
    }
  }
`;

export const UPDATE_PROJECT_FUNDING = gql`
  mutation UpdateProjectFunding(
    $proj_funding_id: Int!
    $fund_dept_unit: String!
    $funding_amount: Int!
    $funding_description: String!
    $funding_program_id: Int!
    $funding_source_id: Int!
    $funding_status_id: Int!
  ) {
    update_moped_proj_funding(
      where: { proj_funding_id: { _eq: $proj_funding_id } }
      _set: {
        fund_dept_unit: $fund_dept_unit
        funding_amount: $funding_amount
        funding_description: $funding_description
        funding_program_id: $funding_program_id
        funding_source_id: $funding_source_id
        funding_status_id: $funding_status_id
      }
    ) {
      affected_rows
    }
  }
`;

export const DELETE_PROJECT_FUNDING = gql`
  mutation DeleteProjectFunding($proj_funding_id: Int!) {
    update_moped_proj_funding(
      _set: { funding_status_id: 0 }
      where: { proj_funding_id: { _eq: $proj_funding_id } }
    ) {
      affected_rows
    }
  }
`;

export const ADD_PROJECT_FUNDING = gql`
  mutation AddProjectFunding($objects: [moped_proj_funding_insert_input!]!) {
    insert_moped_proj_funding(objects: $objects) {
      returning {
        proj_funding_id
      }
    }
  }
`;
