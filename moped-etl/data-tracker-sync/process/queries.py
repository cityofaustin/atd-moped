GET_UNSYNCED_PROJECTS = """
query UnsyncedProjects {
  moped_project(where: { knack_project_id: { _is_null: true }}) {
    project_id
    project_name
    current_phase_view {
      phase_name
    }
    moped_proj_components {
      feature_signals {
        knack_id
      }
    }
  }
}
"""

GET_TEST_UNSYNCED_PROJECTS = """
query UnsyncedProjects($project_id: Int) {
  moped_project(where: { project_id: { _eq: $project_id }, knack_project_id: { _is_null: true }}) {
    project_id
    project_name
    current_phase_view {
      phase_name
    }
    moped_proj_components {
      feature_signals {
        knack_id
      }
    }
  }
}
"""

GET_SYNCED_PROJECTS = """
query SyncedProjects($last_run_date: timestamptz) {
  moped_project(where: { knack_project_id: { _is_null: false }, updated_at: {_gte: $last_run_date}, date_added: {_lt: $last_run_date} }) {
    project_id
    project_name
    current_phase_view {
      phase_name
    }
    moped_proj_components {
      feature_signals {
        knack_id
      }
    }
    knack_project_id
  }
}
"""

GET_TEST_SYNCED_PROJECTS = """
query SyncedProjects($last_run_date: timestamptz, $project_id: Int) {
  moped_project(where: { project_id: { _eq: $project_id }, knack_project_id: { _is_null: false }, updated_at: {_gte: $last_run_date}, date_added: {_lt: $last_run_date} }) {
    project_id
    project_name
    current_phase_view {
      phase_name
    }
    moped_proj_components {
      feature_signals {
        knack_id
      }
    }
    knack_project_id
  }
}
"""

UPDATE_MOPED_PROJECT_KNACK_ID = """
mutation UpdateMopedProjectKnackId($moped_project_id: Int!, $knack_project_id: String) {
  update_moped_project_by_pk(
    pk_columns: { project_id: $moped_project_id }
    _set: { knack_project_id: $knack_project_id }
  ) {
    project_id
  }
}
"""
