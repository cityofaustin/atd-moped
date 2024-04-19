import { gql } from "@apollo/client";

export const NOTES_QUERY = gql`
  query GetProjectNotes($projectNoteConditions: moped_proj_notes_bool_exp!) {
    moped_proj_notes(
      where: $projectNoteConditions
      order_by: { created_at: desc }
    ) {
      moped_user {
        first_name
        last_name
      }
      project_note
      project_id
      created_at
      project_note_id
      project_note_type
      is_deleted
      created_by_user_id
      moped_phase {
        phase_key
        phase_name
      }
    }
  }
`;

export const ADD_PROJECT_NOTE = gql`
  mutation AddProjectNote($objects: [moped_proj_notes_insert_input!]!) {
    insert_moped_proj_notes(objects: $objects) {
      returning {
        project_id
        project_note
      }
    }
  }
`;

export const UPDATE_PROJECT_NOTE = gql`
  mutation UpdateProjectNote(
    $projectId: Int!
    $projectNoteId: Int!
    $projectNote: String!
    $projectNoteType: Int
  ) {
    update_moped_proj_notes(
      _set: { project_note: $projectNote, project_note_type: $projectNoteType }
      where: {
        project_id: { _eq: $projectId }
        project_note_id: { _eq: $projectNoteId }
      }
    ) {
      affected_rows
    }
  }
`;

export const DELETE_PROJECT_NOTE = gql`
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
