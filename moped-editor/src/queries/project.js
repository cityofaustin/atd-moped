import { gql } from "@apollo/client";

export const PROJECT_NAME = gql`
  query ProjectName($projectId: Int) {
    moped_project(where: { project_id: { _eq: $projectId } }) {
      project_name
    }
  }
`;

export const SUMMARY_QUERY = gql`
  query ProjectSummary($projectId: Int) {
    moped_project(where: { project_id: { _eq: $projectId } }) {
      project_name
      project_description
      start_date
      current_phase
      current_status
      capitally_funded
      eCapris_id
      fiscal_year
      project_priority
      project_extent_ids
      project_extent_geojson
    }
  }
`;

export const TEAM_QUERY = gql`
  query TeamSummary($projectId: Int) {
    moped_proj_personnel(where: { project_id: { _eq: $projectId } }) {
      user_id
      notes
    }
    moped_workgroup {
      workgroup_id
      workgroup_name
    }
    moped_users(
      order_by: { last_name: asc }
      where: { status_id: { _eq: 1 } }
    ) {
      first_name
      last_name
      workgroup_id
      user_id
    }
  }
`;

export const UPDATE_PROJECT_EXTENT = gql`
  mutation UpdateProjectExtent(
    $projectId: Int
    $editLayerIds: jsonb
    $editFeatureCollection: jsonb
  ) {
    update_moped_project(
      where: { project_id: { _eq: $projectId } }
      _set: {
        project_extent_geojson: $editFeatureCollection
        project_extent_ids: $editLayerIds
      }
    ) {
      affected_rows
    }
  }
`;
