import { gql } from "@apollo/client";

export const SIGNAL_PROJECTS_QUERY = gql`
  query SignalProjectsQuery {
    moped_project(where: {moped_proj_components: {moped_components: {component_name: {_ilike: "signal"}}}}) {
      current_phase
      project_id
      project_name
      updated_at
    }
  }
`;