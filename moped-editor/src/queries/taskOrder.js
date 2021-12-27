import { gql } from "@apollo/client";

export const UPDATE_PROJECT_TASK_ORDER = gql`
  mutation TaskOrderMutation($project_id: Int!, $task_order: String) {
    update_moped_project_by_pk(
      pk_columns: { project_id: $project_id }
      _set: { task_order: $task_order }
    ) {
      project_id
    }
  }
`;
