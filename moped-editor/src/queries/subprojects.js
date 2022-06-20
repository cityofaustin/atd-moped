import { gql } from "@apollo/client";


export const SUBPROJECT_QUERY = gql`
  query SubprojectSummary($projectId: Int) {
    subprojects: moped_project(where:{project_id: { _eq: $projectId } }) {
      moped_projects {
        project_name
        project_id
        status_id
        current_phase
      }
    }
    subprojectOptions: moped_project(where: {
      _and: [
        {is_deleted: {_eq: false}},
        {parent_project_id: {_is_null: true}}
        {project_id: {_neq: $projectId}}
      ],
      _not: {moped_projects: {}}
    }) {
      project_id
      project_name
    }
    moped_status(
      where: { status_id: { _gt: 0 } }
      order_by: { status_order: asc }
    ) {
      status_id
      status_name
    }
  }
`;

export const UPDATE_PROJECT_SUBPROJECT = gql`
  mutation UpdateProjectSubproject($parentProjectId: Int!, $childProjectId: Int!) {
    update_moped_project(
      where: { project_id: { _eq: $childProjectId } }
      _set: { parent_project_id: $parentProjectId }
    ) {
      affected_rows
    }
  }
`;

export const DELETE_PROJECT_SUBPROJECT = gql`
  mutation UpdateProjectSubproject($childProjectId: Int!) {
    update_moped_project(
      where: { project_id: { _eq: $childProjectId } }
      _set: { parent_project_id: null }
    ) {
      affected_rows
    }
  }
`;
