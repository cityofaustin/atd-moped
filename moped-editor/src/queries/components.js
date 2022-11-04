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
query GetProjectComponents($project_id: Int!) {
  moped_proj_components(where: { project_id: { _eq: $project_id } }) {
    component_id
    description
    internal_table
    component_name
    moped_subcomponents {
      subcomponent_id  
  }
}`;

// Probably can't reuse existing mutation
// Need to come up with how to handle conflicts
export const UPDATE_PROJECT_COMPONENT = gql``;

// probably can use similar mutation to DELETE_MOPED_COMPONENT
export const DELETE_PROJECT_COMPONENT = gql``;
