import { gql } from "@apollo/client";

export const COMMENTS_QUERY = gql`
  query getProjectComments($projectId: Int!) {
    moped_proj_notes(
      where: { project_id: { _eq: $projectId } }
      order_by: { date_created: asc }
    ) {
      added_by
      project_note
      project_id
      date_created
      project_note_id
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
  mutation updateProjectComment($projectId: Int!, $projectNoteId: Int!) {
    update_moped_proj_notes(
      _set: { project_note: "<p>same as it ever was</p>" }
      where: {
        project_id: { _eq: $projectId }
        project_note_id: { _eq: $projectNoteId }
      }
    ) {
      affected_rows
    }
  }
`;

// export const ACCOUNT_USER_PICTURE_UPDATE = gql`
//   mutation UpdateUserPicture($userId: Int!, $picture: String!) {
//     update_moped_users(
//       _set: { picture: $picture }
//       where: { user_id: { _eq: $userId } }
//     ) {
//       affected_rows
//     }
//   }
// `;
