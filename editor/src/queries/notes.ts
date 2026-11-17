import { gql } from "@apollo/client";

export const COMBINED_NOTES_QUERY = gql`
  query GetCombinedProjectNotes(
    $projectNoteConditions: combined_project_notes_view_bool_exp!
  ) {
    combined_project_notes_view(
      where: $projectNoteConditions
      order_by: { created_at: desc }
    ) {
      author
      created_at
      ecapris_subproject_id
      id
      is_editable
      note_type_name
      note_type_slug
      note_type_id
      phase_id
      project_id
      project_note
      created_by_user_id
      original_id
      phase_key
      phase_name
      is_status_update
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
