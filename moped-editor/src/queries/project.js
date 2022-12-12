import { gql } from "@apollo/client";

export const ADD_PROJECT = gql`
  mutation AddProject($object: moped_project_insert_input!) {
    insert_moped_project_one(object: $object) {
      added_by
      project_id
      project_name
      project_description
      project_priority
      ecapris_subproject_id
      fiscal_year
      capitally_funded
      moped_proj_phases {
        phase_id
        is_current_phase
        completion_percentage
        completed
      }
      moped_proj_components {
        moped_proj_features {
          feature_id
        }
      }
      moped_project_types {
        project_type_id
      }
    }
  }
`;

export const SUMMARY_QUERY = gql`
  query ProjectSummary($projectId: Int, $userId: Int) {
    moped_project(where: { project_id: { _eq: $projectId } }) {
      project_id
      project_name
      project_description
      capitally_funded
      ecapris_subproject_id
      fiscal_year
      project_priority
      knack_project_id
      project_sponsor
      project_lead_id
      project_website
      work_assignment_id
      parent_project_id
      interim_project_id
      is_deleted
      moped_project {
        project_name
      }
      moped_proj_components(where: { is_deleted: { _eq: false } }) {
        moped_proj_features(where: { is_deleted: { _eq: false } }) {
          feature_id
          feature
        }
      }
      moped_proj_notes(
        where: { project_note_type: { _eq: 2 }, is_deleted: { _eq: false } }
        order_by: { date_created: desc }
      ) {
        project_note_id
        project_note
        added_by
        added_by_user_id
        date_created
      }
      moped_project_types(where: { is_deleted: { _eq: false } }) {
        id
        moped_type {
          type_name
          type_id
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
          phase_name
          phase_key
        }
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
      }
    }
    moped_phases(order_by: { phase_order: asc }) {
      phase_id
      phase_name
      phase_order
    }
    moped_entity(order_by: { entity_id: asc }) {
      entity_id
      entity_name
    }
    moped_types(order_by: { type_name: asc }) {
      type_id
      type_name
    }
    moped_user_followed_projects(
      where: { project_id: { _eq: $projectId }, user_id: { _eq: $userId } }
    ) {
      project_id
      user_id
    }
  }
`;

export const TYPES_QUERY = gql`
  query TypeQuery {
    moped_types(order_by: { type_name: asc }) {
      type_id
      type_name
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
        date_added
        added_by
        is_deleted
        moped_user {
          first_name
          last_name
          workgroup_id
          user_id
          is_deleted
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
      where: { project_role_id: { _gt: 0 }, active_role: { _eq: true } }
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
      moped_subphases(order_by: { subphase_order: asc }) {
        subphase_name
        subphase_id
      }
    }
    moped_proj_phases(
      where: { project_id: { _eq: $projectId }, is_deleted: { _eq: false } }
      order_by: {
        phase_start: desc
        moped_phase: { phase_order: desc }
        moped_subphase: { subphase_order: desc }
      }
    ) {
      project_phase_id
      is_current_phase
      project_id
      phase_start
      phase_end
      subphase_id
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
    moped_milestones(where: { milestone_id: { _gt: 0 } }) {
      milestone_id
      milestone_name
    }
    moped_proj_milestones(
      where: { project_id: { _eq: $projectId }, is_deleted: { _eq: false } }
      order_by: [{ milestone_order: asc }, { milestone_end: desc }]
    ) {
      milestone_id
      milestone_description
      milestone_estimate
      milestone_end
      completed
      project_milestone_id
      project_id
      moped_milestone {
        milestone_name
        related_phase_id
      }
    }
  }
`;

// use this to update a single moped_proj_phase
export const UPDATE_PROJECT_PHASES_MUTATION = gql`
  mutation ProjectPhasesMutation(
    $project_phase_id: Int!
    $object: moped_proj_phases_set_input!
  ) {
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
  }
`;

// provide an array of project_phase_id's to set them not current
export const CLEAR_CURRENT_PROJECT_PHASES_MUTATION = gql`
  mutation ClearCurrentProjectPhasePKs($ids: [Int!]!) {
    update_moped_proj_phases(
      _set: { is_current_phase: false }
      where: { project_phase_id: { _in: $ids } }
    ) {
      affected_rows
    }
  }
`;

export const UPDATE_PROJECT_MILESTONES_MUTATION = gql`
  mutation ProjectMilestonesMutation(
    $milestone_description: String
    $completed: Boolean
    $milestone_estimate: date = null
    $milestone_end: date = null
    $project_milestone_id: Int!
    $milestone_id: Int!
  ) {
    update_moped_proj_milestones_by_pk(
      pk_columns: { project_milestone_id: $project_milestone_id }
      _set: {
        milestone_description: $milestone_description
        completed: $completed
        milestone_estimate: $milestone_estimate
        milestone_end: $milestone_end
        milestone_id: $milestone_id
      }
    ) {
      project_id
      project_milestone_id
      milestone_estimate
      milestone_end
      completed
      milestone_description
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

export const ADD_PROJECT_PHASE = gql`
  mutation AddProjectPhase($objects: [moped_proj_phases_insert_input!]!) {
    insert_moped_proj_phases(objects: $objects) {
      returning {
        phase_id
        phase_description
        phase_start
        phase_end
        project_phase_id
        is_current_phase
        project_id
        completion_percentage
        completed
      }
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
        milestone_description
        milestone_estimate
        milestone_end
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
      moped_user {
        first_name
        last_name
        picture
        email
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
      create_date
      created_by
      moped_user {
        user_id
        first_name
        last_name
      }
    }
  }
`;

export const PROJECT_FILE_ATTACHMENTS_UPDATE = gql`
  mutation UpdateProjectFileAttachment(
    $fileId: Int!
    $fileName: String!
    $fileType: Int!
    $fileDescription: String!
  ) {
    update_moped_project_files(
      where: { project_file_id: { _eq: $fileId } }
      _set: {
        file_name: $fileName
        file_type: $fileType
        file_description: $fileDescription
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

export const COMPONENTS_QUERY = gql`
  query GetComponents($projectId: Int) {
    moped_proj_components(
      where: { project_id: { _eq: $projectId }, is_deleted: { _eq: false } }
    ) {
      component_id
      description
      name
      project_component_id
      project_id
      moped_components {
        component_name
        component_id
        component_subtype
        line_representation
      }
      moped_proj_components_subcomponents(
        where: { is_deleted: { _eq: false } }
      ) {
        component_subcomponent_id
        project_component_id
        subcomponent_id
        moped_subcomponent {
          subcomponent_id
          subcomponent_name
        }
      }
      moped_proj_features(where: { is_deleted: { _eq: false } }) {
        feature
        feature_id
      }
    }
    moped_subcomponents {
      subcomponent_name
      subcomponent_id
      component_id
    }
    moped_components {
      component_name
      component_subtype
      component_id
      line_representation
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

export const UPDATE_MOPED_COMPONENT = gql`
  mutation UpdateMopedComponent(
    $objects: [moped_proj_components_insert_input!]!
  ) {
    insert_moped_proj_components(
      objects: $objects
      on_conflict: {
        constraint: moped_proj_components_pkey
        update_columns: [component_id, description, is_deleted]
      }
    ) {
      affected_rows
    }
  }
`;

export const DELETE_MOPED_COMPONENT = gql`
  mutation DeleteMopedComponent($projComponentId: Int!) {
    update_moped_proj_components(
      where: { project_component_id: { _eq: $projComponentId } }
      _set: { is_deleted: true }
    ) {
      affected_rows
    }
    update_moped_proj_components_subcomponents(
      where: { project_component_id: { _eq: $projComponentId } }
      _set: { is_deleted: true }
    ) {
      affected_rows
    }
    update_moped_proj_features(
      where: { project_component_id: { _eq: $projComponentId } }
      _set: { is_deleted: true }
    ) {
      affected_rows
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

/**
 * Updates the status update
 */
export const PROJECT_SUMMARY_STATUS_UPDATE_UPDATE = gql`
  mutation ProjectStatusUpdateUpdate(
    $project_note_id: Int_comparison_exp = {}
    $project_note: String = ""
    $added_by: bpchar = ""
  ) {
    update_moped_proj_notes(
      where: { project_note_id: $project_note_id }
      _set: {
        project_note: $project_note
        added_by: $added_by
        project_note_type: 2
      }
    ) {
      affected_rows
    }
  }
`;

export const PROJECT_UPDATE_SPONSOR = gql`
  mutation ProjectUpdateSponsor($projectId: Int!, $entityId: Int!) {
    update_moped_project_by_pk(
      pk_columns: { project_id: $projectId }
      _set: { project_sponsor: $entityId }
    ) {
      project_sponsor
    }
  }
`;

export const PROJECT_UPDATE_LEAD = gql`
  mutation ProjectUpdateLead($projectId: Int!, $entityId: Int!) {
    update_moped_project_by_pk(
      pk_columns: { project_id: $projectId }
      _set: { project_lead_id: $entityId }
    ) {
      project_lead_id
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
  mutation UpdateProjectWebsite($projectId: Int!, $website: String!) {
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

export const PROJECT_UPDATE_TYPES = gql`
  mutation UpdateMopedProjectTypes(
    $types: [moped_project_types_insert_input!]!
    $deleteList: [Int!]!
  ) {
    insert_moped_project_types(objects: $types) {
      affected_rows
    }
    update_moped_project_types(
      where: { id: { _in: $deleteList } }
      _set: { is_deleted: true }
    ) {
      affected_rows
    }
  }
`;

export const PROJECT_UPDATE_ECAPRIS_SUBPROJECT_ID = gql`
  mutation UpdateProjectECapris(
    $projectId: Int!
    $eCapris: numeric!
    $capitallyFunded: Boolean!
  ) {
    update_moped_project(
      where: { project_id: { _eq: $projectId } }
      _set: {
        ecapris_subproject_id: $eCapris
        capitally_funded: $capitallyFunded
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
      _set: { ecapris_subproject_id: null, capitally_funded: false }
    ) {
      affected_rows
    }
  }
`;

export const PROJECT_UPDATE_WORK_ASSIGNMENT_ID = gql`
  mutation UpdateWorkAssignmentID(
    $projectId: Int!
    $work_assignment_id: String!
  ) {
    update_moped_project(
      where: { project_id: { _eq: $projectId } }
      _set: { work_assignment_id: $work_assignment_id }
    ) {
      affected_rows
    }
  }
`;

export const PROJECT_CLEAR_WORK_ASSIGNMENT_ID = gql`
  mutation UpdateWorkAssignmentID($projectId: Int!) {
    update_moped_project(
      where: { project_id: { _eq: $projectId } }
      _set: { work_assignment_id: null }
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

/**
 * Record the ID which Knack assigned a project when pushed to Data Tracker
 */
export const UPDATE_PROJECT_KNACK_ID = gql`
  mutation updateKnackId($project_id: Int, $knack_id: String) {
    update_moped_project(
      where: { project_id: { _eq: $project_id } }
      _set: { knack_project_id: $knack_id }
    ) {
      returning {
        knack_project_id
        project_id
      }
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

export const UPDATE_PROJECT_NAME_QUERY = gql`
  mutation UpdateProjectName($projectId: Int!, $projectName: String!) {
    update_moped_project_by_pk(
      pk_columns: { project_id: $projectId }
      _set: { project_name: $projectName }
    ) {
      project_name
    }
  }
`;

export const LOOKUP_TABLES_QUERY = gql`
  query ProjectLookups {
    moped_fund_sources {
      funding_source_id
      funding_source_name
    }
    moped_types(order_by: { type_name: asc }) {
      type_id
      type_name
    }
    moped_entity(order_by: { entity_id: asc }) {
      entity_id
      entity_name
    }
    moped_tags(order_by: { name: asc }) {
      name
      id
    }
  }
`;
