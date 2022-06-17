import { gql } from "@apollo/client";


export const SUBPROJECT_QUERY = gql`
  query SubprojectSummary($projectId: Int) {
    subprojectOptions: moped_project(where: {
      _and: [
        {is_deleted: {_eq: false}},
        {parent_project_id: {_is_null: true}}
      ],
      _not: {moped_projects: {}}
    }) {
      project_id
      project_name
    }
  }
`;
