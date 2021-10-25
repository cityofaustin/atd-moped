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

export const UPDATE_SIGNAL_PROJECT = gql`
  mutation SignalProjectMutation(
    $milestone_description: String
    $completed: Boolean
    $milestone_estimate: date = null
    $milestone_end: date = null
    $project_milestone_id: Int!
    $milestone_name: String!
  ) {
    update_moped_proj_milestones_by_pk(
      pk_columns: { project_milestone_id: $project_milestone_id }
      _set: {
        milestone_description: $milestone_description
        completed: $completed
        milestone_estimate: $milestone_estimate
        milestone_end: $milestone_end
        milestone_name: $milestone_name
      }
    ) {
      project_id
      project_milestone_id
      milestone_name
      milestone_estimate
      milestone_end
      completed
      milestone_description
    }
  }
`;
