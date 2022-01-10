INSERT_PROJECT = """
mutation AddProject($object: moped_project_insert_input!) {
    insert_moped_project_one(object: $object) {
      project_id
      project_name
      project_description
      project_priority
      current_phase
      current_status
      ecapris_subproject_id
      fiscal_year
      capitally_funded
      start_date
      moped_proj_phases {
        phase_name
        is_current_phase
        status_id
        completion_percentage
        completed
      }
      moped_proj_components {
        moped_proj_features_components {
          moped_proj_feature {
            feature_id
          }
        }
      }
    }
  }"""

UPDATE_NEW_PROJ_FEATURES = """
  mutation UpdateNewProjectFeatures($featureList: [Int!]!, $projectId: Int!) {
    update_moped_proj_features(
      where: { feature_id: { _in: $featureList } }
      _set: { project_id: $projectId }
    ) {
      affected_rows
    }
  }
"""

GET_KNACK_PROJECTS = """
  query GET_KNACK_PROJECTS {
    moped_project(where: {knack_project_id: {_is_null: false}}) {
      project_id
      knack_project_id
    }
  }
"""
