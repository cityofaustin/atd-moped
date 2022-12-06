import { gql } from "@apollo/client";

export const SUBPROJECT_QUERY = gql`
  query SubprojectSummary($projectId: Int) {
    subprojects: moped_project(
      where: { parent_project_id: { _eq: $projectId }, is_deleted: { _eq: false } }
    ) {
      project_name
      project_id
      moped_proj_phases(where: { is_current_phase: { _eq: true } }) {
        moped_phase {
          phase_name
          phase_key
        }
      }
    }
    # todo: we might shouldnt be fetching all projects every time this tab loads...
    subprojectOptions: moped_project(
      where: {
        _and: [
          { is_deleted: { _eq: false } }
          { parent_project_id: { _is_null: true } }
          { project_id: { _neq: $projectId } }
        ]
        _not: { moped_projects: {} }
      }
    ) {
      project_id
      project_name
    }
  }
`;

export const UPDATE_PROJECT_SUBPROJECT = gql`
  mutation UpdateProjectSubproject(
    $parentProjectId: Int!
    $childProjectId: Int!
  ) {
    update_moped_project_by_pk(
      pk_columns: { project_id: $childProjectId }
      _set: { parent_project_id: $parentProjectId }
    ) {
      parent_project_id
    }
  }
`;

export const DELETE_PROJECT_SUBPROJECT = gql`
  mutation UpdateProjectSubproject($childProjectId: Int!) {
    update_moped_project_by_pk(
      pk_columns: { project_id: $childProjectId }
      _set: { parent_project_id: null }
    ) {
      parent_project_id
    }
  }
`;
