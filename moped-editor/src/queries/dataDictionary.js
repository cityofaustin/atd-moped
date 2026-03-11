import { gql } from "@apollo/client";

/** Query for component tags - used in Data Dictionary DataGrid.
 * Excludes soft-deleted tags by default.
 */
export const COMPONENT_TAGS_QUERY = gql`
  query ComponentTagsForDataDictionary(
    $where: moped_component_tags_bool_exp
  ) {
    moped_component_tags(
      where: $where
      order_by: [{ type: asc }, { name: asc }]
    ) {
      id
      name
      type
      slug
      full_name
      is_deleted
    }
  }
`;

/** Query for project tags - used in Data Dictionary DataGrid.
 * Excludes soft-deleted tags by default.
 */
export const PROJECT_TAGS_QUERY = gql`
  query ProjectTagsForDataDictionary($where: moped_tags_bool_exp) {
    moped_tags(where: $where, order_by: { name: asc }) {
      id
      name
      type
      slug
      full_name
      is_deleted
    }
  }
`;

export const INSERT_COMPONENT_TAG = gql`
  mutation InsertComponentTag(
    $object: moped_component_tags_insert_input!
  ) {
    insert_moped_component_tags_one(object: $object) {
      id
      name
      type
      slug
      full_name
      is_deleted
    }
  }
`;

export const UPDATE_COMPONENT_TAG = gql`
  mutation UpdateComponentTag(
    $id: Int!
    $set: moped_component_tags_set_input!
  ) {
    update_moped_component_tags_by_pk(pk_columns: { id: $id }, _set: $set) {
      id
      name
      type
      slug
      full_name
      is_deleted
    }
  }
`;

export const INSERT_PROJECT_TAG = gql`
  mutation InsertProjectTag($object: moped_tags_insert_input!) {
    insert_moped_tags_one(object: $object) {
      id
      name
      type
      slug
      full_name
      is_deleted
    }
  }
`;

export const UPDATE_PROJECT_TAG = gql`
  mutation UpdateProjectTag($id: Int!, $set: moped_tags_set_input!) {
    update_moped_tags_by_pk(pk_columns: { id: $id }, _set: $set) {
      id
      name
      type
      slug
      full_name
      is_deleted
    }
  }
`;
