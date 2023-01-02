import { gql } from "@apollo/client";

export const GET_COMPONENTS_FORM_OPTIONS = gql`
  query GetComponentsFormOptions {
    moped_components(
      order_by: [{ component_name: asc }, { component_subtype: asc }]
      where: { status_id: { _neq: 0 } }
    ) {
      component_id
      component_name
      component_subtype
      line_representation
      feature_layer {
        internal_table
      }
      moped_subcomponents(order_by: { subcomponent_name: asc }) {
        subcomponent_id
        subcomponent_name
      }
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

export const GET_PROJECT_COMPONENTS = gql`
  query GetProjectComponents($projectId: Int!) {
    moped_proj_components(
      where: { project_id: { _eq: $projectId }, is_deleted: { _eq: false } }
    ) {
      project_component_id
      component_id
      description
      moped_components {
        component_name
        component_subtype
        feature_layer {
          internal_table
        }
        line_representation
        moped_subcomponents {
          subcomponent_id
          subcomponent_name
        }
      }
      moped_proj_components_subcomponents(
        where: { is_deleted: { _eq: false } }
      ) {
        subcomponent_id
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
        source_layer
        component_id
        location_name
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
    project_geography(
      where: { project_id: { _eq: $projectId }, is_deleted: { _eq: false } }
    ) {
      geometry: geography
      component_id
      attributes
    }
  }
`;

// This mutation updates component subcomponents by updating all existing
// subcomponents to is_deleted = true and then inserting the new subcomponents
// with is_deleted = false on conflict
export const UPDATE_COMPONENT_ATTRIBUTES = gql`
  mutation UpdateComponentAttributes(
    $projectComponentId: Int!
    $description: String!
    $subcomponents: [moped_proj_components_subcomponents_insert_input!]!
  ) {
    update_moped_proj_components_subcomponents(
      where: { project_component_id: { _eq: $projectComponentId } }
      _set: { is_deleted: true }
    ) {
      affected_rows
    }
    update_moped_proj_components_by_pk(
      pk_columns: { project_component_id: $projectComponentId }
      _set: { description: $description }
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
