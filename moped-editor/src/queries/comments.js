import { gql } from "@apollo/client";

export const COMMENTS_QUERY = gql`
  query GetProjectComments($projectNoteConditions: moped_proj_notes_bool_exp!) {
    moped_proj_notes(
      where: $projectNoteConditions
      order_by: { date_created: desc }
    ) {
      added_by
      added_by_user_id
      project_note
      project_id
      date_created
      project_note_id
      project_note_type
      is_deleted
    }
  }
`;

export const ADD_PROJECT_COMMENT = gql`
  mutation AddProjectComment($objects: [moped_proj_notes_insert_input!]!) {
    insert_moped_proj_notes(objects: $objects) {
      returning {
        project_id
        project_note
      }
    }
  }
`;

export const UPDATE_PROJECT_COMMENT = gql`
  mutation UpdateProjectComment(
    $projectId: Int!
    $projectNoteId: Int!
    $projectNote: String!
  ) {
    update_moped_proj_notes(
      _set: { project_note: $projectNote }
      where: {
        project_id: { _eq: $projectId }
        project_note_id: { _eq: $projectNoteId }
      }
    ) {
      affected_rows
    }
  }
`;

export const DELETE_PROJECT_COMMENT = gql`
  mutation DeleteProjectComent($projectId: Int!, $projectNoteId: Int!) {
    update_moped_proj_notes(
      _set: { is_deleted: true }
      where: {
        project_id: { _eq: $projectId }
        project_note_id: { _eq: $projectNoteId }
      }
    ) {
      affected_rows
    }
  }
`;
