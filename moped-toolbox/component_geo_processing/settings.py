OUTPUT_DIR = "_output"

""" Add column names here to include them in output feature properties. The column
must be available in the `project_list_view` view. To be compatible with ArcGIS Online
the column must return a scalar - no objects or arrays."""
PROJECT_LIST_KEYS = [
    "project_id",
    "project_description",
    "capitally_funded",
    "completion_end_date",
    "construction_start_date",
    "current_phase",
    "current_status",
    "date_added",
    "ecapris_subproject_id",
    "end_date",
    "fiscal_year",
    "funding_source_name",
    "is_deleted",
    "milestone_id",
    "project_designer",
    "project_inspector",
    "project_length",
    "project_name",
    "project_note",
    "project_order",
    "project_partner",
    "project_sponsor",
    "project_team_members",
    "status_id",
    "status_name",
    "task_order_name",
    "timeline_id",
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
                moped_components {
                    component_name
                    component_subtype
                    line_representation
                    status_id
                    moped_subcomponents {
                    subcomponent_name
                    }
                }
                moped_proj_features(where: {is_deleted: {_eq: false}}) {
                    feature
                }
            }
        }
        project_list_view {
            $keys
        }
    }
"""
