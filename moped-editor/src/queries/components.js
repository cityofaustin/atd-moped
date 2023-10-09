import { gql } from "@apollo/client";

export const GET_COMPONENTS_FORM_OPTIONS = gql`
  query GetComponentsFormOptions {
    moped_components(
      order_by: [{ component_name: asc }, { component_subtype: asc }]
      where: { is_deleted: { _eq: false } }
    ) {
      component_id
      component_name
      component_subtype
      line_representation
      feature_layer {
        internal_table
      }
      asset_feature_layer {
        internal_table
      }
      moped_components_subcomponents(
        order_by: { moped_subcomponent: { subcomponent_name: asc } }
      ) {
        moped_subcomponent {
          subcomponent_id
          subcomponent_name
        }
      }
      moped_component_work_types {
        moped_work_type {
          id
          name
        }
      }
    }
    moped_phases(order_by: { phase_order: asc }) {
      phase_name
      phase_id
      moped_subphases {
        subphase_id
        subphase_name
      }
    }
    moped_component_tags(where: { is_deleted: { _eq: false } }) {
      name
      slug
      type
      id
    }
  }
`;

export const ADD_PROJECT_COMPONENT = gql`
  mutation AddProjectComponent($object: moped_proj_components_insert_input!) {
    insert_moped_proj_components_one(object: $object) {
      component_id
    }
  }
`;

export const PROJECT_COMPONENT_FIELDS = gql`
  fragment projectComponentFields on moped_proj_components {
    project_component_id
    component_id
    description
    phase_id
    subphase_id
    completion_date
    project_id
    srts_id
    location_description
    moped_components {
      component_id
      component_name
      component_subtype
      feature_layer {
        internal_table
      }
      asset_feature_layer {
        internal_table
      }
      line_representation
    }
    moped_proj_components_subcomponents(where: { is_deleted: { _eq: false } }) {
      subcomponent_id
      moped_subcomponent {
        subcomponent_name
      }
    }
    moped_proj_component_work_types(where: { is_deleted: { _eq: false } }) {
      moped_work_type {
        id
        name
      }
    }
    moped_proj_component_tags(where: { is_deleted: { _eq: false } }) {
      component_tag_id
      moped_component_tag {
        name
        type
      }
    }
    moped_phase {
      phase_id
      phase_name
      moped_subphases {
        subphase_id
        subphase_name
      }
    }
    moped_subphase {
      subphase_id
      subphase_name
    }
    feature_street_segments(where: { is_deleted: { _eq: false } }) {
      id
      geometry: geography
      source_layer
      ctn_segment_id
      component_id
    }
    feature_intersections(where: { is_deleted: { _eq: false } }) {
      id
      geometry: geography
      source_layer
      intersection_id
      component_id
    }
    feature_signals(where: { is_deleted: { _eq: false } }) {
      id
      geometry: geography
      component_id
      location_name
      signal_id
      signal_type
      knack_id
    }
    feature_drawn_lines(where: { is_deleted: { _eq: false } }) {
      id
      geometry: geography
      source_layer
      component_id
    }
    feature_drawn_points(where: { is_deleted: { _eq: false } }) {
      id
      geometry: geography
      source_layer
      component_id
    }
  }
`;

export const GET_PROJECT_COMPONENTS = gql`
  ${PROJECT_COMPONENT_FIELDS}
  query GetProjectComponents($projectId: Int!, $parentProjectId: Int = 0) {
    moped_proj_components(
      where: { project_id: { _eq: $projectId }, is_deleted: { _eq: false } }
    ) {
      ...projectComponentFields
    }
    project_geography(
      where: { project_id: { _eq: $projectId }, is_deleted: { _eq: false } }
    ) {
      geometry: geography
      component_id
      attributes
    }
    parentProjectComponents: moped_proj_components(
      where: {
        project_id: { _eq: $parentProjectId }
        is_deleted: { _eq: false }
      }
    ) {
      ...projectComponentFields
    }
    siblingProjects: moped_project(
      where: {
        parent_project_id: { _eq: $parentProjectId }
        is_deleted: { _eq: false }
      }
    ) {
      moped_proj_components(
        where: { project_id: { _neq: $projectId }, is_deleted: { _eq: false } }
      ) {
        ...projectComponentFields
      }
    }
    childProjects: moped_project(
      where: {
        parent_project_id: { _eq: $projectId }
        is_deleted: { _eq: false }
      }
    ) {
      moped_proj_components(where: { is_deleted: { _eq: false } }) {
        ...projectComponentFields
      }
    }
  }
`;

// This mutation updates component subcomponents and component tags by first updating *all* existing
// subcomponents and tags to is_deleted = true and then inserting the new subcomponents and tags
// with is_deleted = false on conflict (Attributes that are not deleted in the UI by the user
// are switched to is_deleted = false by the mutation)
// Also deletes any feature_signals records which may be necessary due to a component switching from 
// a signal asset feature to a non-signal component
export const UPDATE_COMPONENT_ATTRIBUTES = gql`
  mutation UpdateComponentAttributes(
    $projectComponentId: Int!
    $componentId: Int!
    $description: String!
    $subcomponents: [moped_proj_components_subcomponents_insert_input!]!
    $workTypes: [moped_proj_component_work_types_insert_input!]!
    $phaseId: Int
    $subphaseId: Int
    $completionDate: timestamptz
    $componentTags: [moped_proj_component_tags_insert_input!]!
    $srtsId: String
    $locationDescription: String
  ) {
    update_moped_proj_components_subcomponents(
      where: { project_component_id: { _eq: $projectComponentId } }
      _set: { is_deleted: true }
    ) {
      affected_rows
    }
    update_moped_proj_component_work_types(
      where: { project_component_id: { _eq: $projectComponentId } }
      _set: { is_deleted: true }
    ) {
      affected_rows
    }
    update_moped_proj_component_tags(
      where: { project_component_id: { _eq: $projectComponentId } }
      _set: { is_deleted: true }
    ) {
      affected_rows
    }
    update_moped_proj_components_by_pk(
      pk_columns: { project_component_id: $projectComponentId }
      _set: {
        component_id: $componentId
        description: $description
        phase_id: $phaseId
        subphase_id: $subphaseId
        completion_date: $completionDate
        srts_id: $srtsId
        location_description: $locationDescription
      }
    ) {
      project_component_id
    }
    insert_moped_proj_components_subcomponents(
      objects: $subcomponents
      on_conflict: {
        constraint: unique_component_and_subcomponent
        update_columns: [is_deleted]
      }
    ) {
      affected_rows
    }
    insert_moped_proj_component_work_types(
      objects: $workTypes
      on_conflict: {
        constraint: moped_proj_component_work_types_project_component_id_work_type_
        update_columns: [is_deleted]
      }
    ) {
      affected_rows
    }
    insert_moped_proj_component_tags(
      objects: $componentTags
      on_conflict: {
        constraint: unique_component_and_tag
        update_columns: [is_deleted]
      }
    ) {
      affected_rows
    }
    update_feature_signals(
      where: { component_id: { _eq: $projectComponentId } }
      _set: { is_deleted: true }
    ) {
      affected_rows
    }
  }
`;

// This mutation updates component subcomponents in same way as UPDATE_COMPONENT_ATTRIBUTES.
// It also updates all component feature_signals, feature_intersections, and feature_drawn_points
// to is_deleted = true and then inserts the new signal.
export const UPDATE_SIGNAL_COMPONENT = gql`
  mutation UpdateSignalComponent(
    $projectComponentId: Int!
    $description: String!
    $subcomponents: [moped_proj_components_subcomponents_insert_input!]!
    $workTypes: [moped_proj_component_work_types_insert_input!]!
    $signals: [feature_signals_insert_input!]!
    $phaseId: Int
    $subphaseId: Int
    $completionDate: timestamptz
    $componentTags: [moped_proj_component_tags_insert_input!]!
    $srtsId: String
    $locationDescription: String
  ) {
    update_moped_proj_components_subcomponents(
      where: { project_component_id: { _eq: $projectComponentId } }
      _set: { is_deleted: true }
    ) {
      affected_rows
    }
    update_moped_proj_component_work_types(
      where: { project_component_id: { _eq: $projectComponentId } }
      _set: { is_deleted: true }
    ) {
      affected_rows
    }
    update_moped_proj_component_tags(
      where: { project_component_id: { _eq: $projectComponentId } }
      _set: { is_deleted: true }
    ) {
      affected_rows
    }
    update_feature_signals(
      where: { component_id: { _eq: $projectComponentId } }
      _set: { is_deleted: true }
    ) {
      affected_rows
    }
    update_feature_drawn_points(
      where: { component_id: { _eq: $projectComponentId } }
      _set: { is_deleted: true }
    ) {
      affected_rows
    }
    update_feature_intersections(
      where: { component_id: { _eq: $projectComponentId } }
      _set: { is_deleted: true }
    ) {
      affected_rows
    }
    update_moped_proj_components_by_pk(
      pk_columns: { project_component_id: $projectComponentId }
      _set: {
        description: $description
        phase_id: $phaseId
        subphase_id: $subphaseId
        completion_date: $completionDate
        srts_id: $srtsId
        location_description: $locationDescription
      }
    ) {
      project_component_id
    }
    insert_moped_proj_components_subcomponents(
      objects: $subcomponents
      on_conflict: {
        constraint: unique_component_and_subcomponent
        update_columns: [is_deleted]
      }
    ) {
      affected_rows
    }
    insert_moped_proj_component_work_types(
      objects: $workTypes
      on_conflict: {
        constraint: moped_proj_component_work_types_project_component_id_work_type_
        update_columns: [is_deleted]
      }
    ) {
      affected_rows
    }
    insert_feature_signals(objects: $signals) {
      affected_rows
    }
    insert_moped_proj_component_tags(
      objects: $componentTags
      on_conflict: {
        constraint: unique_component_and_tag
        update_columns: [is_deleted]
      }
    ) {
      affected_rows
    }
  }
`;

export const UPDATE_COMPONENT_FEATURES = gql`
  mutation UpdateComponentFeatures(
    $updates: [features_updates!]!
    $streetSegments: [feature_street_segments_insert_input!]!
    $intersections: [feature_intersections_insert_input!]!
    $signals: [feature_signals_insert_input!]!
    $drawnLines: [feature_drawn_lines_insert_input!]!
    $drawnPoints: [feature_drawn_points_insert_input!]!
    $drawnLinesDragUpdates: [feature_drawn_lines_updates!]!
    $drawnPointsDragUpdates: [feature_drawn_points_updates!]!
  ) {
    insert_feature_street_segments(objects: $streetSegments) {
      affected_rows
    }
    insert_feature_intersections(objects: $intersections) {
      affected_rows
    }
    insert_feature_signals(objects: $signals) {
      affected_rows
    }
    insert_feature_drawn_lines(objects: $drawnLines) {
      affected_rows
    }
    insert_feature_drawn_points(objects: $drawnPoints) {
      affected_rows
    }
    update_features_many(updates: $updates) {
      affected_rows
    }
    update_feature_drawn_lines_many(updates: $drawnLinesDragUpdates) {
      affected_rows
    }
    update_feature_drawn_points_many(updates: $drawnPointsDragUpdates) {
      affected_rows
    }
  }
`;

export const DELETE_PROJECT_COMPONENT = gql`
  mutation DeleteMopedComponent($projectComponentId: Int!) {
    update_moped_proj_components_by_pk(
      pk_columns: { project_component_id: $projectComponentId }
      _set: { is_deleted: true }
    ) {
      project_component_id
    }
    update_moped_proj_components_subcomponents(
      where: { project_component_id: { _eq: $projectComponentId } }
      _set: { is_deleted: true }
    ) {
      affected_rows
    }
  }
`;

// Move a component to another project
export const UPDATE_COMPONENT_PROJECT_ID = gql`
  mutation UpdateComponentAttributes($componentId: Int!, $projectId: Int!) {
    update_moped_proj_components_by_pk(
      pk_columns: { project_component_id: $componentId }
      _set: { project_id: $projectId }
    ) {
      project_component_id
    }
  }
`;
