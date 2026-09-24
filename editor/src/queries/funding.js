import { gql } from "@apollo/client";
import { graphql } from "src/gql";

export const COMBINED_FUNDING_QUERY = graphql(`
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
      source_name
      status_name
      ecapris_funding_id: fao_id
      is_synced_from_ecapris
      is_manual
      unit_long_name
      ecapris_subproject_id
      should_use_ecapris_amount
      ecapris_funding_files(where: { is_deleted: { _eq: false } }) {
        id
        moped_project_file {
          project_file_id
          file_url
          file_key
          file_name
        }
      }
      moped_funding_files(where: { is_deleted: { _eq: false } }) {
        id
        moped_project_file {
          project_file_id
          file_url
          file_key
          file_name
        }
      }
      ecapris_funding {
        id
        fdu
        fao_id
        unit_long_name
        funding_source_id
        funding_program_id
        app
      }
      moped_fund_source {
        funding_source_id
        funding_source_name
      }
      moped_fund_program {
        funding_program_id
        funding_program_name
      }
      moped_fund_status {
        funding_status_id
        funding_status_name
      }
    }
  }
`);

export const GET_FUNDING_LOOKUPS = graphql(`
  query GetFundingLookups {
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
    ecapris_options: ecapris_subproject_funding(
      distinct_on: ecapris_subproject_id
    ) {
      ecapris_subproject_id
      subproject_name
    }
    moped_file_types {
      id
      name
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
`);

export const ECAPRIS_SUBPROJECT_FDU_QUERY = gql`
  query EcaprisFdusSubproject($ecapris_subproject_id: String!) {
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

export const UPDATE_PROJECT_FUNDING = graphql(`
  mutation UpdateProjectFunding(
    $proj_funding_id: Int!
    $funding_amount: Int
    $funding_description: String
    $funding_program_id: Int
    $funding_source_id: Int
    $funding_status_id: Int
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
`);

export const DELETE_PROJECT_FUNDING = graphql(`
  mutation DeleteProjectFunding($proj_funding_id: Int!) {
    update_moped_proj_funding(
      _set: { is_deleted: true }
      where: { proj_funding_id: { _eq: $proj_funding_id } }
    ) {
      affected_rows
    }
    update_files_project_funding(
      where: { entity_id: { _eq: $proj_funding_id } }
      _set: { is_deleted: true }
    ) {
      affected_rows
    }
  }
`);

/* Delete funding record and also transfer file attachments back to
synced eCAPRIS record that is restored. Executes in one transaction. */
export const DELETE_PROJECT_FUNDING_AND_REATTACH = graphql(`
  mutation DeleteProjectFundingAndReattach(
    $proj_funding_id: Int!
    $attachmentObjects: [files_ecapris_funding_insert_input!]!
  ) {
    update_moped_proj_funding(
      _set: { is_deleted: true }
      where: { proj_funding_id: { _eq: $proj_funding_id } }
    ) {
      affected_rows
    }
    update_files_project_funding(
      where: { entity_id: { _eq: $proj_funding_id } }
      _set: { is_deleted: true }
    ) {
      affected_rows
    }
    insert_files_ecapris_funding(
      objects: $attachmentObjects
      on_conflict: {
        constraint: files_ecapris_funding_project_id_entity_id_file_id_key
        update_columns: [is_deleted]
      }
    ) {
      affected_rows
    }
  }
`);

export const ADD_PROJECT_FUNDING = graphql(`
  mutation AddProjectFunding(
    $fundingObjects: [moped_proj_funding_insert_input!]!
  ) {
    insert_moped_proj_funding(objects: $fundingObjects) {
      returning {
        proj_funding_id
      }
    }
  }
`);

/* Add funding record and also transfer synced eCAPRIS row attachments to
the new Moped funding record inserted as an override of eCAPRIS. Executes in 
one transaction. */
export const ADD_PROJECT_FUNDING_AND_REATTACH = graphql(`
  mutation AddProjectFundingAndReattach(
    $fundingObjects: [moped_proj_funding_insert_input!]!
    $entityId: Int!
    $projectId: Int!
  ) {
    insert_moped_proj_funding(objects: $fundingObjects) {
      returning {
        proj_funding_id
      }
    }
    update_files_ecapris_funding(
      where: { entity_id: { _eq: $entityId }, project_id: { _eq: $projectId } }
      _set: { is_deleted: true }
    ) {
      affected_rows
    }
  }
`);

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
      work_activity_files(where: { is_deleted: { _eq: false } }) {
        id
        moped_project_file {
          project_file_id
          file_url
          file_key
          file_name
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

export const ADD_WORK_ACTIVITY = gql`
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
    $fileObjects: [moped_project_files_insert_input!]!
  ) {
    update_moped_proj_work_activity_by_pk(
      pk_columns: { id: $id }
      _set: $object
    ) {
      id
    }
    insert_moped_project_files(objects: $fileObjects) {
      affected_rows
    }
  }
`;

export const DELETE_WORK_ACTIVITY = gql`
  mutation DeleteWorkActivity($id: Int!) {
    update_moped_proj_work_activity_by_pk(
      pk_columns: { id: $id }
      _set: { is_deleted: true }
    ) {
      id
    }
    update_files_project_work_activities(
      where: { entity_id: { _eq: $id } }
      _set: { is_deleted: true }
    ) {
      affected_rows
    }
  }
`;
