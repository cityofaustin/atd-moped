import { gql } from "@apollo/client";

export const FUNDING_QUERY = gql`
  query ProjectFunding($projectId: Int) {
    moped_proj_funding(
      where: { project_id: { _eq: $projectId }, is_deleted: { _eq: false } }
    ) {
      proj_funding_id
      added_by
      date_added
      fund_dept_unit
      fund
      dept_unit
      funding_amount
      funding_description
      funding_program_id
      funding_source_id
      funding_status_id
      is_deleted
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
    moped_funds {
      fund_id
      fund_name
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
    $dept_unit: jsonb
    $fund: jsonb
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
        dept_unit: $dept_unit
        fund: $fund
      }
    ) {
      affected_rows
    }
  }
`;

export const DELETE_PROJECT_FUNDING = gql`
  mutation DeleteProjectFunding($proj_funding_id: Int!) {
    update_moped_proj_funding(
      _set: { is_deleted: true }
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

export const UPDATE_FUNDING_TASK_ORDERS = gql`
  mutation AddProjectFunding($projectId: Int!, $taskOrders: jsonb!) {
    update_moped_project(
      _set: { task_order: $taskOrders }
      where: { project_id: { _eq: $projectId } }
    ) {
      affected_rows
    }
  }
`;

export const PURCHASE_ORDER_QUERY = gql`
  query ProjectPurchaseOrder($projectId: Int) {
    moped_purchase_order(
      where: { project_id: { _eq: $projectId }, is_deleted: { _eq: false } }
      order_by: {id: asc}
    ) {
      vendor
      id
      purchase_order_number
      description
    }
  }
`;

export const ADD_PURCHASE_ORDER = gql`
  mutation AddPurchaseOrder($objects: [moped_purchase_order_insert_input!]!) {
    insert_moped_purchase_order(objects: $objects) {
      returning {
        id
      }
    }
  }
`;

export const UPDATE_PURCHASE_ORDER = gql`
  mutation UpdatePurchaseOrder(
    $id: Int!
    $vendor: String!
    $purchase_order_number: String!
    $description: String!
  ) {
    update_moped_purchase_order_by_pk(
      pk_columns: { id: $id }
      _set: {
        vendor: $vendor
        purchase_order_number: $purchase_order_number
        description: $description
      }
    ) {
      id
    }
  }
`;

export const DELETE_PURCHASE_ORDER = gql`
  mutation DeletePurchaseOrder(
    $id: Int!
  ) {
    update_moped_purchase_order_by_pk(
      pk_columns: { id: $id }
      _set: {
        is_deleted: true
      }
    ) {
      id
    }
  }
`;
