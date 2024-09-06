CREATE VIEW exploded_component_arcgis_online_view AS
SELECT
    component_arcgis_online_view.project_id,
    component_arcgis_online_view.project_component_id,
    ST_GEOMETRYTYPE(dump.geom) AS geometry_type,
    dump.path[1] AS point_index, -- ordinal value of the point in the MultiPoint geometry
    component_arcgis_online_view.geometry AS original_geometry,
    ST_ASGEOJSON(dump.geom) AS exploded_geometry, -- noqa: RF04
    component_arcgis_online_view.line_geometry,
    component_arcgis_online_view.completion_date,
    component_arcgis_online_view.completion_end_date,
    component_arcgis_online_view.component_categories,
    component_arcgis_online_view.component_description,
    component_arcgis_online_view.component_id,
    component_arcgis_online_view.component_location_description,
    component_arcgis_online_view.component_name,
    component_arcgis_online_view.component_name_full,
    component_arcgis_online_view.component_phase_id,
    component_arcgis_online_view.component_phase_name,
    component_arcgis_online_view.component_phase_name_simple,
    component_arcgis_online_view.component_subcomponents,
    component_arcgis_online_view.component_subtype,
    component_arcgis_online_view.component_tags,
    component_arcgis_online_view.component_url,
    component_arcgis_online_view.component_work_types,
    component_arcgis_online_view.construction_start_date,
    component_arcgis_online_view.contract_numbers,
    component_arcgis_online_view.council_districts,
    component_arcgis_online_view.council_districts_searchable,
    component_arcgis_online_view.current_phase_name,
    component_arcgis_online_view.current_phase_name_simple,
    component_arcgis_online_view.ecapris_subproject_id,
    component_arcgis_online_view.feature_ids,
    component_arcgis_online_view.funding_source_name,
    component_arcgis_online_view.funding_sources,
    component_arcgis_online_view.interim_project_component_id,
    component_arcgis_online_view.interim_project_id,
    component_arcgis_online_view.is_within_city_limits,
    component_arcgis_online_view.knack_data_tracker_project_record_id,
    component_arcgis_online_view.length_feet_total,
    component_arcgis_online_view.length_miles_total,
    component_arcgis_online_view.parent_project_id,
    component_arcgis_online_view.parent_project_name,
    component_arcgis_online_view.parent_project_name_full,
    component_arcgis_online_view.parent_project_url,
    component_arcgis_online_view.project_added_by,
    component_arcgis_online_view.project_description,
    component_arcgis_online_view.project_designer,
    component_arcgis_online_view.project_development_status,
    component_arcgis_online_view.project_development_status_date,
    component_arcgis_online_view.project_development_status_date_calendar_year,
    component_arcgis_online_view.project_development_status_date_calendar_year_month,
    component_arcgis_online_view.project_development_status_date_calendar_year_month_numeric,
    component_arcgis_online_view.project_development_status_date_calendar_year_quarter,
    component_arcgis_online_view.project_development_status_date_fiscal_year,
    component_arcgis_online_view.project_development_status_date_fiscal_year_quarter,
    component_arcgis_online_view.project_inspector,
    component_arcgis_online_view.project_lead,
    component_arcgis_online_view.project_name,
    component_arcgis_online_view.project_name_secondary,
    component_arcgis_online_view.project_name_full,
    component_arcgis_online_view.project_partners,
    component_arcgis_online_view.project_phase_id,
    component_arcgis_online_view.project_phase_name,
    component_arcgis_online_view.project_phase_name_simple,
    component_arcgis_online_view.project_sponsor,
    component_arcgis_online_view.project_status_update,
    component_arcgis_online_view.project_status_update_date_created,
    component_arcgis_online_view.project_tags,
    component_arcgis_online_view.project_team_members,
    component_arcgis_online_view.project_updated_at,
    component_arcgis_online_view.project_url,
    component_arcgis_online_view.project_website,
    component_arcgis_online_view.public_process_status,
    component_arcgis_online_view.related_project_ids,
    component_arcgis_online_view.related_project_ids_searchable,
    component_arcgis_online_view.signal_ids,
    component_arcgis_online_view.srts_id,
    component_arcgis_online_view.substantial_completion_date,
    component_arcgis_online_view.substantial_completion_date_estimated,
    component_arcgis_online_view.task_order_names,
    component_arcgis_online_view.type_name,
    component_arcgis_online_view.workgroup_contractors
FROM
    component_arcgis_online_view,
    LATERAL ST_DUMP(ST_GEOMFROMGEOJSON(component_arcgis_online_view.geometry)) AS dump -- noqa: RF04
WHERE
    ST_GEOMETRYTYPE(ST_GEOMFROMGEOJSON(component_arcgis_online_view.geometry)) = 'ST_MultiPoint';
