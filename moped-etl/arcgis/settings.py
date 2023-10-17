UPLOAD_CHUNK_SIZE = 100

SERVICE_NAMES = {"points": "MOPED_Points", "lines": "MOPED_Lines"}

COMPONENTS_QUERY = """
query {
  component_arcgis_online_view {
    added_by
    completion_date
    completion_end_date
    component_description
    component_id
    component_name
    component_name_full
    component_phase_id
    component_phase_name
    component_phase_name_simple
    component_subtype
    component_tags
    construction_start_date
    contract_numbers
    contractors
    council_districts
    current_phase_name
    current_phase_name_simple
    ecapris_subproject_id
    feature_ids
    funding_source_name
    geometry
    interim_project_component_id
    interim_project_id
    is_project_component_deleted
    is_project_deleted
    length_feet_total
    location_description
    project_component_id
    project_description
    project_designer
    project_id
    project_inspector
    project_lead
    project_name
    project_note
    project_note_date
    project_partner
    project_phase_id
    project_phase_name
    project_phase_name_simple
    project_sponsor
    project_tags
    project_team_members
    public_process_status
    signal_ids
    srts_id
    subcomponents
    task_order_name
    type_name
    updated_at
    work_types
  }
}
"""
