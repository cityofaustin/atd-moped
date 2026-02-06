import { gql } from "@apollo/client";
import { PROJECT_COMPONENT_FIELDS } from "./components";

export const ADD_PROJECT = gql`
  mutation AddProject($object: moped_project_insert_input!) {
    insert_moped_project_one(object: $object) {
      added_by
      project_id
      project_name
      project_description
      ecapris_subproject_id
      moped_proj_phases {
        phase_id
        is_current_phase
      }
    }
  }
`;

export const SUMMARY_QUERY = gql`
  ${PROJECT_COMPONENT_FIELDS}
  query ProjectSummary($projectId: Int, $userId: Int) {
    moped_project(where: { project_id: { _eq: $projectId } }) {
      project_id
      project_name
      project_name_secondary
      project_name_full
      project_description
      ecapris_subproject_id
      knack_project_id
      project_sponsor
      project_lead_id
      project_website
      parent_project_id
      interim_project_id
      is_deleted
      should_sync_ecapris_statuses
      should_sync_ecapris_funding
      moped_project {
        project_name
        project_name_full
      }
      moped_proj_components(
        where: {
          is_deleted: { _eq: false }
          feature_signals: { is_deleted: { _eq: false } }
        }
      ) {
        feature_signals(where: { is_deleted: { _eq: false } }) {
          signal_id
          knack_id
          id
        }
      }
      moped_entity {
        entity_name
        entity_id
      }
      moped_project_lead {
        entity_name
        entity_id
      }
      moped_proj_phases(where: { is_current_phase: { _eq: true } }) {
        moped_phase {
          phase_id
          phase_name
          phase_key
        }
      }
      moped_public_process_statuses {
        id
        name
      }
      project_list_view {
        project_id
        project_status_update
        project_status_update_date_created
        project_status_update_author
      }
    }
    moped_proj_partners(
      where: { project_id: { _eq: $projectId }, is_deleted: { _eq: false } }
    ) {
      proj_partner_id
      project_id
      entity_id
      moped_entity {
        entity_name
        entity_id
      }
    }
    moped_phases(order_by: { phase_order: asc }) {
      phase_id
      phase_name
      phase_order
    }
    moped_entity(
      order_by: { entity_name: asc }
      where: { is_deleted: { _eq: false } }
    ) {
      entity_id
      entity_name
    }
    moped_note_types {
      id
      name
      slug
      source
    }
    moped_public_process_statuses(order_by: { id: asc }) {
      id
      name
    }
    moped_user_followed_projects(
      where: { project_id: { _eq: $projectId }, user_id: { _eq: $userId } }
    ) {
      project_id
      user_id
    }
    project_geography(
      where: { project_id: { _eq: $projectId }, is_deleted: { _eq: false } }
    ) {
      geometry: geography
      attributes
      council_districts
    }
    moped_proj_components(
      where: { project_id: { _eq: $projectId }, is_deleted: { _eq: false } }
    ) {
      ...projectComponentFields
    }
    childProjects: moped_project(
      where: {
        parent_project_id: { _eq: $projectId }
        is_deleted: { _eq: false }
      }
    ) {
      project_geography(where: { is_deleted: { _eq: false } }) {
        council_districts
      }
      moped_proj_components(where: { is_deleted: { _eq: false } }) {
        ...projectComponentFields
      }
    }
  }
`;

export const TEAM_QUERY = gql`
  query TeamQuery($projectId: Int!) {
    moped_project_by_pk(project_id: $projectId) {
      project_id
      moped_proj_personnel(
        where: { is_deleted: { _eq: false } }
        order_by: { project_personnel_id: asc }
      ) {
        notes
        project_personnel_id
        created_at
        created_by_user_id
        is_deleted
        moped_user {
          first_name
          last_name
          user_id
          is_deleted
          email
          moped_workgroup {
            workgroup_id
            workgroup_name
          }
        }
        moped_proj_personnel_roles(where: { is_deleted: { _eq: false } }) {
          id
          project_personnel_id
          project_role_id
          moped_project_role {
            project_role_id
            project_role_name
            project_role_description
          }
        }
      }
    }
    moped_project_roles(
      order_by: { project_role_name: asc }
      where: { active_role: { _eq: true } }
    ) {
      project_role_id
      project_role_name
      project_role_description
    }
    moped_users(
      order_by: { last_name: asc }
      where: { is_deleted: { _eq: false } }
    ) {
      first_name
      last_name
      workgroup_id
      user_id
      is_deleted
      email
    }
    moped_workgroup(
      order_by: { workgroup_id: asc }
      where: { is_deleted: { _eq: false } }
    ) {
      workgroup_id
      workgroup_name
    }
  }
`;

export const INSERT_PROJECT_PERSONNEL = gql`
  mutation InserProjectPersonnel($object: moped_proj_personnel_insert_input!) {
    insert_moped_proj_personnel_one(object: $object) {
      project_personnel_id
    }
  }
`;

export const UPDATE_PROJECT_PERSONNEL = gql`
  mutation UpdateProjectPersonnel(
    $deleteIds: [Int!]
    $id: Int!
    $updatePersonnelObject: moped_proj_personnel_set_input!
    $addRolesObjects: [moped_proj_personnel_roles_insert_input!]!
  ) {
    update_moped_proj_personnel_by_pk(
      pk_columns: { project_personnel_id: $id }
      _set: $updatePersonnelObject
    ) {
      project_personnel_id
    }
    update_moped_proj_personnel_roles(
      where: { id: { _in: $deleteIds } }
      _set: { is_deleted: true }
    ) {
      affected_rows
    }
    insert_moped_proj_personnel_roles(objects: $addRolesObjects) {
      affected_rows
    }
  }
`;

export const DELETE_PROJECT_PERSONNEL = gql`
  mutation DeleteProjectPersonnel($id: Int!) {
    update_moped_proj_personnel_by_pk(
      pk_columns: { project_personnel_id: $id }
      _set: { is_deleted: true }
    ) {
      is_deleted
      project_personnel_id
    }
  }
`;

export const TIMELINE_QUERY = gql`
  query TeamTimeline($projectId: Int) {
    moped_phases(order_by: { phase_order: asc }) {
      phase_id
      phase_name
      phase_order
      moped_subphases(order_by: { subphase_name: asc }) {
        subphase_name
        subphase_id
      }
    }
    moped_subphases {
      subphase_name
      subphase_id
    }
    moped_proj_phases(
      where: { project_id: { _eq: $projectId }, is_deleted: { _eq: false } }
      order_by: [
        { moped_phase: { phase_order: asc } }
        { moped_subphase: { subphase_name: asc } }
      ]
    ) {
      project_phase_id
      is_current_phase
      project_id
      phase_start
      phase_end
      phase_id
      subphase_id
      is_phase_start_confirmed
      is_phase_end_confirmed
      moped_subphase {
        subphase_id
        subphase_name
      }
      phase_description
      moped_phase {
        phase_id
        phase_name
      }
    }
    moped_milestones(where: { is_deleted: { _eq: false } }) {
      milestone_id
      milestone_name
      related_phase_id
    }
    moped_proj_milestones(
      where: { project_id: { _eq: $projectId }, is_deleted: { _eq: false } }
      order_by: [{ milestone_order: asc }, { date_actual: desc }]
    ) {
      milestone_id
      description
      date_estimate
      date_actual
      completed
      project_milestone_id
      project_id
      moped_milestone {
        milestone_id
        milestone_name
        related_phase_id
      }
    }
    project_list_view(where: { project_id: { _eq: $projectId } }) {
      substantial_completion_date
      project_id
    }
    moped_note_types {
      id
      name
      slug
    }
  }
`;

/**
 * For all the following project phase mutations, the mutation to set
 * current phases to false must run first or unique constraint could be violated
 */

export const ADD_PROJECT_PHASE = gql`
  mutation AddProjectPhase(
    $objects: [moped_proj_phases_insert_input!]!
    $current_phase_id_to_clear: [Int!] = []
  ) {
    update_moped_proj_phases(
      _set: { is_current_phase: false }
      where: { project_phase_id: { _in: $current_phase_id_to_clear } }
    ) {
      affected_rows
    }
    insert_moped_proj_phases(objects: $objects) {
      returning {
        phase_id
        phase_description
        phase_start
        phase_end
        project_phase_id
        is_current_phase
        project_id
      }
    }
  }
`;

export const ADD_PROJECT_PHASE_AND_STATUS_UPDATE = gql`
  mutation AddProjectPhaseWithStatusUpdate(
    $objects: [moped_proj_phases_insert_input!]!
    $current_phase_id_to_clear: [Int!] = []
    $noteObjects: [moped_proj_notes_insert_input!]!
  ) {
    update_moped_proj_phases(
      _set: { is_current_phase: false }
      where: { project_phase_id: { _in: $current_phase_id_to_clear } }
    ) {
      affected_rows
    }
    insert_moped_proj_phases(objects: $objects) {
      returning {
        phase_id
        phase_description
        phase_start
        phase_end
        project_phase_id
        is_current_phase
        project_id
      }
    }
    insert_moped_proj_notes(objects: $noteObjects) {
      returning {
        project_id
        project_note
      }
    }
  }
`;

export const UPDATE_PROJECT_PHASE_AND_ADD_STATUS_UPDATE = gql`
  mutation ProjectPhasesMutation(
    $project_phase_id: Int!
    $object: moped_proj_phases_set_input!
    $current_phase_id_to_clear: [Int!] = []
    $noteObjects: [moped_proj_notes_insert_input!]!
  ) {
    update_moped_proj_phases(
      _set: { is_current_phase: false }
      where: { project_phase_id: { _in: $current_phase_id_to_clear } }
    ) {
      affected_rows
    }
    update_moped_proj_phases_by_pk(
      pk_columns: { project_phase_id: $project_phase_id }
      _set: $object
    ) {
      project_id
      project_phase_id
      phase_id
      phase_start
      phase_end
      subphase_id
      is_current_phase
      phase_description
    }
    insert_moped_proj_notes(objects: $noteObjects) {
      returning {
        project_id
        project_note
      }
    }
  }
`;

// Delete a project phase **and** make it not current
export const DELETE_PROJECT_PHASE = gql`
  mutation DeleteProjectPhase($project_phase_id: Int!) {
    update_moped_proj_phases(
      _set: { is_deleted: true, is_current_phase: false }
      where: { project_phase_id: { _eq: $project_phase_id } }
    ) {
      affected_rows
    }
  }
`;

export const UPDATE_PROJECT_MILESTONES_MUTATION = gql`
  mutation ProjectMilestonesMutation(
    $description: String
    $completed: Boolean
    $date_estimate: date = null
    $date_actual: date = null
    $project_milestone_id: Int!
    $milestone_id: Int!
  ) {
    update_moped_proj_milestones_by_pk(
      pk_columns: { project_milestone_id: $project_milestone_id }
      _set: {
        description: $description
        completed: $completed
        date_estimate: $date_estimate
        date_actual: $date_actual
        milestone_id: $milestone_id
      }
    ) {
      project_id
      project_milestone_id
      date_estimate
      date_actual
      completed
      description
    }
  }
`;

export const DELETE_PROJECT_MILESTONE = gql`
  mutation DeleteProjectMilestone($project_milestone_id: Int!) {
    update_moped_proj_milestones(
      _set: { is_deleted: true }
      where: { project_milestone_id: { _eq: $project_milestone_id } }
    ) {
      affected_rows
    }
  }
`;

export const ADD_PROJECT_MILESTONE = gql`
  mutation AddProjectMilestone(
    $objects: [moped_proj_milestones_insert_input!]!
  ) {
    insert_moped_proj_milestones(objects: $objects) {
      returning {
        milestone_id
        description
        date_estimate
        date_actual
        completed
        project_milestone_id
        project_id
      }
    }
  }
`;

export const PROJECT_FOLLOW = gql`
  mutation FollowProject($object: moped_user_followed_projects_insert_input!) {
    insert_moped_user_followed_projects_one(object: $object) {
      project_id
      user_id
    }
  }
`;

export const PROJECT_UNFOLLOW = gql`
  mutation UnfollowProject($project_id: Int!, $user_id: Int!) {
    delete_moped_user_followed_projects(
      where: { project_id: { _eq: $project_id }, user_id: { _eq: $user_id } }
    ) {
      affected_rows
    }
  }
`;

export const PROJECT_ACTIVITY_LOG = gql`
  query getMopedProjectChanges($projectId: Int!) {
    moped_activity_log(
      where: { record_project_id: { _eq: $projectId } }
      order_by: { created_at: desc }
    ) {
      activity_id
      created_at
      record_project_id
      record_type
      description
      operation_type
      record_data
      updated_by_user {
        first_name
        last_name
        picture
        email
        user_id
      }
    }
    moped_users {
      first_name
      last_name
      user_id
      email
    }
    moped_phases {
      phase_id
      phase_name
    }
    moped_subphases {
      subphase_id
      subphase_name
    }
    moped_milestones {
      milestone_id
      milestone_name
    }
    moped_tags(order_by: { name: asc }) {
      name
      id
    }
    moped_entity(order_by: { entity_id: asc }) {
      entity_id
      entity_name
    }
    moped_fund_sources(order_by: { funding_source_id: asc }) {
      funding_source_id
      funding_source_name
    }
    moped_fund_programs(order_by: { funding_program_id: asc }) {
      funding_program_id
      funding_program_name
    }
    moped_fund_status(order_by: { funding_status_id: asc }) {
      funding_status_id
      funding_status_name
    }
    moped_public_process_statuses(order_by: { id: asc }) {
      id
      name
    }
    moped_components(order_by: { component_id: asc }) {
      component_id
      component_name
      component_subtype
    }
    deprecated_moped_types(order_by: { type_id: asc }) {
      type_id
      type_name
    }
    activity_log_lookup_tables: moped_activity_log(
      where: { record_project_id: { _eq: $projectId } }
      distinct_on: record_type
    ) {
      record_type
    }
  }
`;

export const PROJECT_ACTIVITY_LOG_DETAILS = gql`
  query getMopedProjectChanges($activityId: uuid!) {
    moped_activity_log(where: { activity_id: { _eq: $activityId } }) {
      activity_id
      created_at
      record_project_id
      record_type
      record_data
      description
      operation_type
      moped_user {
        first_name
        last_name
        user_id
      }
      updated_by_user {
        first_name
        last_name
        picture
        email
        user_id
      }
    }
    activity_log_lookup_tables: moped_activity_log(
      where: { activity_id: { _eq: $activityId } }
      distinct_on: record_type
    ) {
      record_type
    }
  }
`;

export const PROJECT_FILE_ATTACHMENTS = gql`
  query MopedProjectFiles($projectId: Int!) {
    moped_project_files(
      order_by: { created_at: desc }
      where: { project_id: { _eq: $projectId }, is_deleted: { _eq: false } }
    ) {
      project_file_id
      project_id
      file_key
      file_name
      file_type
      file_description
      file_size
      file_metadata
      file_description
      created_at
      created_by_user_id
      file_url
      moped_user {
        user_id
        first_name
        last_name
      }
    }
    moped_file_types {
      id
      name
    }
  }
`;

export const PROJECT_FILE_ATTACHMENTS_UPDATE = gql`
  mutation UpdateProjectFileAttachment(
    $fileId: Int!
    $fileName: String!
    $fileType: Int!
    $fileDescription: String
    $fileUrl: String
  ) {
    update_moped_project_files(
      where: { project_file_id: { _eq: $fileId } }
      _set: {
        file_name: $fileName
        file_type: $fileType
        file_description: $fileDescription
        file_url: $fileUrl
      }
    ) {
      affected_rows
    }
  }
`;

export const PROJECT_FILE_ATTACHMENTS_DELETE = gql`
  mutation DeleteProjectFileAttachment($fileId: Int!) {
    update_moped_project_files(
      where: { project_file_id: { _eq: $fileId } }
      _set: { is_deleted: true }
    ) {
      affected_rows
    }
  }
`;

export const PROJECT_FILE_ATTACHMENTS_CREATE = gql`
  mutation insert_single_article($object: moped_project_files_insert_input!) {
    insert_moped_project_files(objects: [$object]) {
      affected_rows
    }
  }
`;

export const PROJECT_ARCHIVE = gql`
  mutation ArchiveMopedProject($projectId: Int!) {
    update_moped_project(
      where: { project_id: { _eq: $projectId } }
      _set: { is_deleted: true }
    ) {
      affected_rows
    }
    clear_parent_project: update_moped_project(
      where: { parent_project_id: { _eq: $projectId } }
      _set: { parent_project_id: null }
    ) {
      affected_rows
    }
  }
`;

export const SIGNAL_COMPONENTS_QUERY = gql`
  query GetSignalComponents {
    moped_components(where: { component_name: { _ilike: "signal" } }) {
      component_name
      component_subtype
      component_id
      line_representation
    }
  }
`;

/**
 * Inserts a project summary status update
 */
export const PROJECT_SUMMARY_STATUS_UPDATE_INSERT = gql`
  mutation ProjectStatusUpdateInsert(
    $statusUpdate: [moped_proj_notes_insert_input!]!
  ) {
    insert_moped_proj_notes(objects: $statusUpdate) {
      affected_rows
      __typename
    }
  }
`;

export const PROJECT_UPDATE_SPONSOR = gql`
  mutation ProjectUpdateSponsor($projectId: Int!, $fieldValueId: Int) {
    update_moped_project_by_pk(
      pk_columns: { project_id: $projectId }
      _set: { project_sponsor: $fieldValueId }
    ) {
      project_sponsor
    }
  }
`;

export const PROJECT_UPDATE_LEAD = gql`
  mutation ProjectUpdateLead($projectId: Int!, $fieldValueId: Int) {
    update_moped_project_by_pk(
      pk_columns: { project_id: $projectId }
      _set: { project_lead_id: $fieldValueId }
    ) {
      project_lead_id
    }
  }
`;

export const PROJECT_UPDATE_PUBLIC_PROCESS = gql`
  mutation ProjectUpdatePublicProcess($projectId: Int!, $fieldValueId: Int) {
    update_moped_project_by_pk(
      pk_columns: { project_id: $projectId }
      _set: { public_process_status_id: $fieldValueId }
    ) {
      public_process_status_id
    }
  }
`;

export const PROJECT_UPDATE_PARTNERS = gql`
  mutation UpdateMopedProjectPartners(
    $partners: [moped_proj_partners_insert_input!]!
    $deleteList: [Int!]!
  ) {
    insert_moped_proj_partners(objects: $partners) {
      affected_rows
    }
    update_moped_proj_partners(
      where: { proj_partner_id: { _in: $deleteList } }
      _set: { is_deleted: true }
    ) {
      affected_rows
    }
  }
`;

export const PROJECT_UPDATE_WEBSITE = gql`
  mutation UpdateProjectWebsite($projectId: Int!, $website: String) {
    update_moped_project(
      where: { project_id: { _eq: $projectId } }
      _set: { project_website: $website }
    ) {
      affected_rows
    }
  }
`;

export const PROJECT_UPDATE_DESCRIPTION = gql`
  mutation UpdateProjectDescription($projectId: Int!, $description: String!) {
    update_moped_project(
      where: { project_id: { _eq: $projectId } }
      _set: { project_description: $description }
    ) {
      affected_rows
    }
  }
`;

export const PROJECT_UPDATE_ECAPRIS_SUBPROJECT_ID = gql`
  mutation UpdateProjectECapris($projectId: Int!, $eCapris: String!) {
    update_moped_project(
      where: { project_id: { _eq: $projectId } }
      _set: {
        ecapris_subproject_id: $eCapris
        should_sync_ecapris_statuses: true
        should_sync_ecapris_funding: true
      }
    ) {
      affected_rows
    }
  }
`;

export const PROJECT_CLEAR_ECAPRIS_SUBPROJECT_ID = gql`
  mutation UpdateProjectECaprisClear($projectId: Int!) {
    update_moped_project(
      where: { project_id: { _eq: $projectId } }
      _set: {
        ecapris_subproject_id: null
        should_sync_ecapris_statuses: false
        should_sync_ecapris_funding: false
      }
    ) {
      affected_rows
    }
  }
`;

export const PROJECT_UPDATE_INTERIM_ID = gql`
  mutation UpdateProjectInterimId($projectId: Int!, $interimProjectId: Int) {
    update_moped_project_by_pk(
      pk_columns: { project_id: $projectId }
      _set: { interim_project_id: $interimProjectId }
    ) {
      interim_project_id
    }
  }
`;

export const PROJECT_CLEAR_INTERIM_ID = gql`
  mutation UpdateProjectInterimId($projectId: Int!) {
    update_moped_project_by_pk(
      pk_columns: { project_id: $projectId }
      _set: { interim_project_id: null }
    ) {
      interim_project_id
    }
  }
`;

export const PROJECT_CLEAR_NO_CURRENT_PHASE = gql`
  mutation ClearProjectPhases($projectId: Int!) {
    update_moped_proj_phases(
      _set: { is_current_phase: false }
      where: { project_id: { _eq: $projectId } }
    ) {
      affected_rows
    }
    update_moped_project(
      _set: { current_phase: null }
      where: { project_id: { _eq: $projectId } }
    ) {
      affected_rows
    }
  }
`;

export const UPDATE_PROJECT_TASK_ORDER = gql`
  mutation TaskOrderMutation($projectId: Int!, $taskOrder: jsonb) {
    update_moped_project(
      where: { project_id: { _eq: $projectId } }
      _set: { task_order: $taskOrder }
    ) {
      affected_rows
      returning {
        task_order
        project_id
      }
    }
  }
`;

export const PROJECT_UPDATE_ECAPRIS_SYNC = gql`
  mutation UpdateProjectECaprisSync($projectId: Int!, $shouldSync: Boolean!) {
    update_moped_project(
      where: { project_id: { _eq: $projectId } }
      _set: { should_sync_ecapris_statuses: $shouldSync }
    ) {
      affected_rows
    }
  }
`;

export const PROJECT_UPDATE_ECAPRIS_FUNDING_SYNC = gql`
  mutation UpdateProjectECaprisFundingSync(
    $projectId: Int!
    $shouldSync: Boolean!
  ) {
    update_moped_project(
      where: { project_id: { _eq: $projectId } }
      _set: { should_sync_ecapris_funding: $shouldSync }
    ) {
      affected_rows
    }
  }
`;

export const UPDATE_PROJECT_NAMES_QUERY = gql`
  mutation UpdateProjectName(
    $projectId: Int!
    $projectName: String!
    $projectNameSecondary: String
  ) {
    update_moped_project_by_pk(
      pk_columns: { project_id: $projectId }
      _set: {
        project_name: $projectName
        project_name_secondary: $projectNameSecondary
      }
    ) {
      project_name
      project_name_secondary
    }
  }
`;

export const LOOKUP_TABLES_QUERY = gql`
  query ProjectLookups {
    moped_fund_sources(order_by: { funding_source_name: asc }) {
      funding_source_id
      funding_source_name
    }
    moped_fund_programs(order_by: { funding_program_name: asc }) {
      funding_program_id
      funding_program_name
    }
    moped_entity(
      order_by: { entity_id: asc }
      where: { is_deleted: { _eq: false } }
    ) {
      entity_id
      entity_name
    }
    moped_tags(order_by: { name: asc }) {
      name
      id
    }
    moped_public_process_statuses(order_by: { name: asc }) {
      name
      id
    }
    moped_users(
      order_by: { last_name: asc }
      where: { is_deleted: { _eq: false } }
    ) {
      first_name
      last_name
      user_id
    }
    moped_phases(order_by: { phase_name: asc }) {
      phase_id
      phase_name
    }
    moped_components(order_by: { component_name_full: asc }) {
      component_id
      component_name_full
    }
    layer_council_district {
      id
      council_district
    }
    moped_work_types(
      order_by: { name: asc }
      where: { is_deleted: { _eq: false } }
    ) {
      id
      name
    }
  }
`;

export const PROJECT_OPTIONS = gql`
  query ProjectOptions($projectId: Int!) {
    moped_project(
      where: {
        _and: [
          { is_deleted: { _eq: false } }
          { project_id: { _neq: $projectId } }
        ]
      }
    ) {
      project_id
      project_name_full
    }
  }
`;

export const GET_PROJECTS_GEOGRAPHIES = gql`
  query GetProjectsComponents($projectIds: [Int!]) {
    project_geography(
      where: { project_id: { _in: $projectIds }, is_deleted: { _eq: false } }
    ) {
      project_id
      project_name
      component_id
      geography
      attributes
      component_name
      line_representation
    }
  }
`;
