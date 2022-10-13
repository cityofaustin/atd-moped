import { gql } from "@apollo/client";

export const TAGS_QUERY = gql`
  query TagsQuery($projectId: Int!) {
    moped_proj_tags(
      where: { project_id: { _eq: $projectId }, is_deleted: { _eq: false } }
    ) {
      id
      moped_tag {
        name
        id
      }
    }
    moped_tags(where: { is_deleted: { _eq: false } }, order_by: { name: asc }) {
      id
      name
    }
  }
`;

export const DELETE_PROJECT_TAG = gql`
  mutation DeleteProjectTag($id: Int!) {
    update_moped_proj_tags_by_pk(
      pk_columns: { id: $id }
      _set: { is_deleted: true }
    ) {
      id
    }
  }
`;

export const ADD_PROJECT_TAGS = gql`
  mutation AddProjectTags($objects: [moped_proj_tags_insert_input!]!) {
    insert_moped_proj_tags(objects: $objects) {
      returning {
        id
      }
    }
  }
`;
