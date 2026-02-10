import { gql } from "@apollo/client";

export const COMBINED_FUNDING_QUERY = gql`
  query GetCombinedProjectFunding(
    $projectFundingConditions: combined_project_funding_view_bool_exp!
  ) {
    combined_project_funding_view(
      where: $projectFundingConditions
      order_by: { id: desc }
    ) {
      id
      proj_funding_id: original_id
      fdu
      funding_amount: amount
      funding_description: description
      program_name
      funding_program_id
      source_name
      funding_source_id
      status_name
      funding_status_id
      ecapris_funding_id: fao_id
      is_synced_from_ecapris
      is_manual
      unit_long_name
      ecapris_subproject_id
      should_use_ecapris_amount
    }
    moped_fund_sources(where: { is_deleted: { _eq: false } }) {
      funding_source_id
      funding_source_name
    }
    moped_fund_programs(where: { is_deleted: { _eq: false } }) {
      funding_program_id
      funding_program_name
    }
    moped_fund_status(where: { funding_status_id: { _neq: 0 } }) {
      funding_status_id
      funding_status_name
    }
  }
`;

export const ECAPRIS_FDU_OPTIONS_QUERY = gql`
  query EcaprisFdu {
    ecapris_subproject_funding {
      ecapris_funding_id: fao_id
      ecapris_subproject_id
      fdu
      unit_long_name
      amount: app
      funding_source_id
      moped_fund_source {
        funding_source_id
        funding_source_name
      }
      funding_program_id
      moped_fund_program {
        funding_program_id
        funding_program_name
      }
    }
  }
`;

export const ECAPRIS_SUBPROJECT_FDU_QUERY = gql`
  query EcaprisFduSubproject($ecapris_subproject_id: String!) {
    ecapris_subproject_funding(
      where: { ecapris_subproject_id: { _eq: $ecapris_subproject_id } }
    ) {
      ecapris_funding_id: fao_id
      fdu
      unit_long_name
      fdu_status
      amount: app
      funding_source_id
      funding_program_id
    }
  }
`;

export const ECAPRIS_SUBPROJECT_FUNDING_QUERY = gql`
  query EcaprisFduSubproject($fdu: String!) {
    ecapris_subproject_funding(where: { fdu: { _eq: $fdu } }) {
      ecapris_funding_id: fao_id
      fdu
      unit_long_name
      fdu_status
      amount: app
      funding_source_id
      funding_program_id
    }
  }
`;

export const UPDATE_PROJECT_FUNDING = gql`
  mutation UpdateProjectFunding(
    $proj_funding_id: Int!
    $funding_amount: Int
    $funding_description: String
    $funding_program_id: Int
    $funding_source_id: Int
    $funding_status_id: Int!
    $fdu: String
    $unit_long_name: String
    $should_use_ecapris_amount: Boolean
  ) {
    update_moped_proj_funding_by_pk(
      pk_columns: { proj_funding_id: $proj_funding_id }
      _set: {
        funding_amount: $funding_amount
        funding_description: $funding_description
        funding_program_id: $funding_program_id
        funding_source_id: $funding_source_id
        funding_status_id: $funding_status_id
        fdu: $fdu
        unit_long_name: $unit_long_name
        should_use_ecapris_amount: $should_use_ecapris_amount
      }
    ) {
      proj_funding_id
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

export const WORK_ACTIVITY_QUERY = gql`
  query ProjectWorkActivity($projectId: Int) {
    moped_proj_work_activity(
      where: { project_id: { _eq: $projectId }, is_deleted: { _eq: false } }
      order_by: { id: asc }
    ) {
      workgroup_contractor
      id
      project_id
      contract_number
      description
      work_assignment_id
      contract_amount
      status_id
      reference_id
      work_order_url
      moped_work_activity_status {
        id
        name
      }
      status_note
      task_orders
      created_at
      created_by_user {
        first_name
        last_name
        moped_workgroup {
          workgroup_name
        }
      }
      updated_at
      updated_by_user {
        first_name
        last_name
        moped_workgroup {
          workgroup_name
        }
      }
    }
  }
`;

export const WORK_ACTIVITY_STATUSES_QUERY = gql`
  query WorkActivityStatusOptions {
    moped_proj_work_activity_status(where: { is_deleted: { _eq: false } }) {
      value: id
      label: name
    }
  }
`;

export const ADD_WORK_ACTIVITIY = gql`
  mutation AddWorkActivity($object: moped_proj_work_activity_insert_input!) {
    insert_moped_proj_work_activity_one(object: $object) {
      id
    }
  }
`;

export const UPDATE_WORK_ACTIVITY = gql`
  mutation UpdateWorkActivity(
    $id: Int!
    $object: moped_proj_work_activity_set_input!
  ) {
    update_moped_proj_work_activity_by_pk(
      pk_columns: { id: $id }
      _set: $object
    ) {
      id
    }
  }
`;

export const DELETE_WORK_ACTIVITY = gql`
  mutation DeletePurchaseOrder($id: Int!) {
    update_moped_proj_work_activity_by_pk(
      pk_columns: { id: $id }
      _set: { is_deleted: true }
    ) {
      id
    }
  }
`;
