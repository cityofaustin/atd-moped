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
      task_order
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

MOPED_KNACK_PROJECTS_QUERY = """
  query MyQuery {
    moped_project(where: {knack_project_id: {_is_null: false}}) {
      project_id
      knack_project_id
    }
  }
"""

PROJECT_PHASES_QUERY = """
query GetPhases {
  moped_phases {
    phase_id
    phase_name
  }
}
"""

PROJECT_SUBPHASES_QUERY = """
query GetSubphases {
  moped_subphases {
    subphase_id
    subphase_name
  }
}
"""

MOPED_USERS_QUERY = """
query GetAllUsers {
  moped_users {
    email
    first_name
    last_name
    user_id
  }
}
"""


MOPED_TYPES_QUERY = """
query GetMopedTypes {
  moped_types {
    type_id
    type_name
  }
}
"""


KNACK_PROJECTS_QUERY = """
  query GetKnackProjects {
    moped_project(where: {knack_project_id: {_is_null: false}}) {
      project_id
      knack_project_id
    }
  }
"""

MOPED_FUND_SOURCES_QUERY = """
query GetFundSources {
  moped_fund_sources {
    funding_source_category
    funding_source_id
    funding_source_name
  }
}
"""

MOPED_FUND_PROGRAMS_QUERY = """
query GetFundPrograms {
  moped_fund_programs {
    funding_program_id
    funding_program_name
  }
}
"""

MOPED_ENTITIES_QUERY = """
  query GetMopedEntities {
    moped_entity {
      entity_id
      entity_name
    }
  }
"""

MOPED_PROJ_ROLES_QUERY = """
query GetProjectRoles {
  moped_project_roles {
    active_role
    date_added
    project_role_id
    project_role_name
  }
}
"""