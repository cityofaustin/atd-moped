UPLOAD_CHUNK_SIZE = 100

LAYER_IDS = {"points": 0, "lines": 1, "combined": 2, "exploded": 3}

COMPONENTS_QUERY_BY_LAST_UPDATE_DATE = """
query GetProjectsComponents($project_where: moped_project_bool_exp!, $component_where: component_arcgis_online_view_bool_exp!) {
  moped_project(where: $project_where) {
    project_id
  }
  component_arcgis_online_view(where: $component_where) {
    component_categories
    component_description
    component_id
    component_location_description
    component_name
    component_name_full
    component_phase_id
    component_phase_name
    component_phase_name_simple
    component_subcomponents
    component_subtype
    component_tags
    component_url
    component_work_types
    construction_start_date
    contract_numbers
    council_districts
    council_districts_searchable
    current_phase_name
    current_phase_name_simple
    ecapris_subproject_id
    feature_ids
    funding_source_name
    funding_sources
    geometry
    interim_project_component_id
    interim_project_id
    is_within_city_limits
    knack_data_tracker_project_record_id
    length_feet_total
    length_miles_total
    line_geometry
    parent_project_id
    parent_project_name
    parent_project_name_full
    parent_project_url
    project_added_by
    project_component_id
    project_description
    project_designer
    project_development_status
    project_development_status_date
    project_development_status_date_calendar_year
    project_development_status_date_calendar_year_month
    project_development_status_date_calendar_year_month_numeric
    project_development_status_date_calendar_year_quarter
    project_development_status_date_fiscal_year
    project_development_status_date_fiscal_year_quarter
    project_id
    project_inspector
    project_lead
    project_name
    project_name_secondary
    project_name_full
    project_partners
    project_phase_id
    project_phase_name
    project_phase_name_simple
    project_sponsor
    project_status_update
    project_status_update_date_created
    project_tags
    project_team_members
    project_updated_at
    project_url
    project_website
    public_process_status
    related_project_ids
    related_project_ids_searchable
    signal_ids
    srts_id
    substantial_completion_date
    substantial_completion_date_estimated
    task_order_names
    type_name
    workgroup_contractors
  }
}
"""

# line_geometry
EXPLODED_COMPONENTS_QUERY_BY_LAST_UPDATE_DATE = """
query GetExplodedProjectsComponents($where: exploded_component_arcgis_online_view_bool_exp!) {
  exploded_component_arcgis_online_view(where: $where) {
    geometry: exploded_geometry
    project_component_id
  }
}
"""
