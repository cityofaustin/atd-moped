OUTPUT_DIR = "_output"

""" Add column names here to include them in output feature properties. The column
must be available in the `project_list_view` view. To be compatible with ArcGIS Online
the column must return a scalar - no objects or arrays."""
PROJECT_LIST_KEYS = [
    "project_id",
    "project_description",
    "construction_start_date",
    "current_phase",
    "date_added",
    "ecapris_subproject_id",
    "funding_source_name",
    "is_deleted",
    "project_designer",
    "project_inspector",
    "project_name",
    "project_note",
    "project_partner",
    "project_sponsor",
    "project_team_members",
    "task_order_name",
    "type_name",
    "updated_at",
]

"""This query fetches projects with components, and separately all projects from the
`project_list_view` view. Todo: once we transition to native PostGIS data types,
we can save a lot of code by creating a view which returns geojson"""
QUERY_TEMPLATE = """
    query ProjectComponentsQuery {
    moped_project(where: {is_deleted: {_eq: false}}) {
            project_id
            moped_proj_tags(where: {is_deleted: {_eq: false}}) {
                moped_tag {
                    name
                }
            }
            moped_proj_components(where: {is_deleted: {_eq: false}}) {
                project_component_id
      					moped_proj_component_tags {
                  moped_component_tag {
                    name
                  }
                }
      					moped_proj_component_work_types {
                  moped_work_type {
                    name
                  }
                }
                moped_components {
                    component_name
                    component_subtype
                    line_representation
                }
                moped_proj_components_subcomponents {
                  moped_subcomponent {
                    subcomponent_name
                  }
                }
            }
        }
        project_geography(where: { is_deleted: { _eq: false}}) {
          feature_id
          component_id
          geometry: geography
          council_districts
        }
        project_list_view {
            $keys
        }
    }
"""
