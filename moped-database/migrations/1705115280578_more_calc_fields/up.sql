DROP VIEW project_list_view CASCADE;

CREATE OR REPLACE VIEW public.project_list_view
AS WITH project_person_list_lookup AS (
    SELECT
      mpp.project_id,
      string_agg(DISTINCT concat(mu.first_name, ' ', mu.last_name, ':', mpr.project_role_name), ','::text) AS project_team_members
    FROM moped_proj_personnel mpp
      JOIN moped_users mu ON mpp.user_id = mu.user_id
      JOIN moped_proj_personnel_roles mppr ON mpp.project_personnel_id = mppr.project_personnel_id
      JOIN moped_project_roles mpr ON mppr.project_role_id = mpr.project_role_id
    WHERE mpp.is_deleted = false
      AND mppr.is_deleted = false
    GROUP BY mpp.project_id
  ), funding_sources_lookup AS (
    SELECT 
      mpf_1.project_id,
      string_agg(mfs.funding_source_name, ', '::text) AS funding_source_name
    FROM moped_proj_funding mpf_1
      LEFT JOIN moped_fund_sources mfs ON mpf_1.funding_source_id = mfs.funding_source_id
    WHERE mpf_1.is_deleted = false
    GROUP BY mpf_1.project_id
  ), project_type_lookup AS (
    SELECT
      mpt.project_id,
      string_agg(mt.type_name, ', '::text) AS type_name
      FROM moped_project_types mpt
        LEFT JOIN moped_types mt ON mpt.project_type_id = mt.type_id AND mpt.is_deleted = false
    GROUP BY mpt.project_id
  ), child_project_lookup AS (
    SELECT jsonb_agg(children.project_id) AS children_project_ids,
      children.parent_project_id AS parent_id
      FROM moped_project AS children
        JOIN moped_project AS parent ON (parent.project_id = children.parent_project_id)
        WHERE children.is_deleted = false
    GROUP BY parent_id
  ), work_activities AS (
      SELECT
          project_id,
          string_agg(task_order_objects.task_order_object ->> 'display_name'::text,
              ', '::text) AS task_order_names,
          string_agg(task_order_objects.task_order_object ->> 'task_order'::text,
              ', '::text) AS task_order_names_short,
          jsonb_agg(DISTINCT task_order_objects.task_order_object) FILTER (WHERE task_order_objects.task_order_object IS NOT NULL) AS task_orders,
          string_agg(DISTINCT mpwa.workgroup_contractor,
          ', '::text) AS workgroup_contractors,
          string_agg(mpwa.contract_number,
          ', '::text) AS contract_numbers FROM moped_proj_work_activity mpwa
      LEFT JOIN LATERAL jsonb_array_elements(mpwa.task_orders) task_order_objects (task_order_object) ON TRUE WHERE 1 = 1
      AND mpwa.is_deleted = FALSE
  GROUP BY
      mpwa.project_id
  ), moped_proj_components_subtypes AS (
    SELECT
      mpc.project_id,
      string_agg(DISTINCT mc.component_name_full, ', '::text) AS components
    FROM moped_proj_components mpc
    LEFT JOIN moped_components mc ON mpc.component_id = mc.component_id
    WHERE mpc.is_deleted = FALSE
    GROUP BY mpc.project_id
  )
 SELECT
    mp.project_id,
    mp.project_name,
    mp.project_description,
    mp.ecapris_subproject_id,
    mp.project_website,
    mp.date_added,
    mp.is_deleted,
    mp.updated_at,
    current_phase.phase_name as current_phase,
    current_phase.phase_key as current_phase_key,
    current_phase.phase_name_simple as current_phase_simple,
    ppll.project_team_members,
    me.entity_name AS project_sponsor,
    mel.entity_name AS project_lead,
    mpps.name AS public_process_status,
    mp.interim_project_id,
    mp.parent_project_id,
    mp.knack_project_id,
    proj_status_update.project_note as project_status_update,
    proj_status_update.date_created as project_status_update_date_created,
    work_activities.workgroup_contractors,
    work_activities.contract_numbers,
    work_activities.task_order_names,
    work_activities.task_order_names_short,
    work_activities.task_orders,
    'placeholder text' as work_plan_category,
    '2024-01-01T00:00:00−06:00' as work_plan_category_date,
    9999 as work_plan_category_date_calendar_year,
    'placeholder text' as work_plan_category_date_calendar_year_month,
    'placeholder text' as work_plan_category_date_calendar_year_month_numeric,
    'placeholder text' as work_plan_category_date_calendar_year_quarter,
    999 as work_plan_category_date_fiscal_year,
    'placeholder text' as work_plan_category_date_fiscal_year_quarter,
    (SELECT project_name
      FROM moped_project
      WHERE project_id = mp.parent_project_id
    ) as parent_project_name,
    cpl.children_project_ids,
    string_agg(DISTINCT me2.entity_name, ', '::text) AS project_partner,
    (SELECT JSON_AGG(json_build_object('signal_id', feature_signals.signal_id, 'knack_id', feature_signals.knack_id, 'location_name', feature_signals.location_name, 'signal_type', feature_signals.signal_type, 'id', feature_signals.id))
        FROM moped_proj_components components   
        LEFT JOIN feature_signals
          ON (feature_signals.component_id = components.project_component_id)
        WHERE TRUE
          AND components.is_deleted = false
          AND components.project_id = mp.project_id
          AND feature_signals.signal_id is not null
          AND feature_signals.is_deleted = false
        ) as project_feature,
    fsl.funding_source_name,
    ptl.type_name,
    ( -- get the date of the construction phase with the earliest start date
      SELECT min(phases.phase_start)
      FROM moped_proj_phases phases
      WHERE true
        AND phases.project_id = mp.project_id 
        AND phases.phase_id = 9 -- phase_id 9 is construction
        AND phases.is_deleted = false
    ) AS construction_start_date,
    ( -- get the date of the completion phase with the latest end date
      SELECT max(phases.phase_end)
      FROM moped_proj_phases phases
      WHERE true 
        AND phases.project_id = mp.project_id 
        AND phases.phase_id = 11 -- phase_id 11 is complete
        AND phases.is_deleted = false
      ) AS completion_end_date,
    ( -- get the earliest confirmed phase_start or phase_end with a simple phase of 'Complete' 
      SELECT
          min(min_confirmed_date)
      FROM (
          -- earliest confirmed phase start
          SELECT
              min(phases.phase_start) AS min_confirmed_date
          FROM
              moped_proj_phases phases
          LEFT JOIN moped_phases ON phases.phase_id = moped_phases.phase_id
          WHERE
              TRUE
              AND phases.phase_start IS NOT NULL
              AND phases.is_phase_start_confirmed = TRUE
              AND phases.project_id = mp.project_id
              AND moped_phases.phase_name_simple = 'Complete'
              AND phases.is_deleted = FALSE
          UNION ALL
          -- earliest confirmed phase end
          SELECT
              min(phases.phase_end) AS min_confirmed_date
          FROM
              moped_proj_phases phases
          LEFT JOIN moped_phases ON phases.phase_id = moped_phases.phase_id
          WHERE
              TRUE
              AND phases.phase_end IS NOT NULL
              AND phases.is_phase_end_confirmed = TRUE
              AND phases.project_id = mp.project_id
              AND moped_phases.phase_name_simple = 'Complete'
              AND phases.is_deleted = FALSE
        ) min_confirmed_dates
      ) AS substantial_completion_date,
    ( -- get me a list of the inspectors for this project
      SELECT string_agg(concat(users.first_name, ' ', users.last_name), ', '::text) AS string_agg
      FROM moped_proj_personnel mpp
        JOIN moped_users users ON mpp.user_id = users.user_id
        JOIN moped_proj_personnel_roles mppr ON mpp.project_personnel_id = mppr.project_personnel_id
        JOIN moped_project_roles mpr ON mppr.project_role_id = mpr.project_role_id
      WHERE 1 = 1
        AND mpr.project_role_name = 'Inspector'::text
        AND mpp.is_deleted = false
        AND mppr.is_deleted = false
        AND mpp.project_id = mp.project_id
      GROUP BY mpp.project_id) AS project_inspector,
    ( -- get me a list of the designers for this project
      SELECT string_agg(concat(users.first_name, ' ', users.last_name), ', '::text) AS string_agg
      FROM moped_proj_personnel mpp
        JOIN moped_users users ON mpp.user_id = users.user_id
        JOIN moped_proj_personnel_roles mppr ON mpp.project_personnel_id = mppr.project_personnel_id
        JOIN moped_project_roles mpr ON mppr.project_role_id = mpr.project_role_id
      WHERE 1 = 1
        AND mpr.project_role_name = 'Designer'::text
        AND mpp.is_deleted = false
        AND mppr.is_deleted = false
        AND mpp.project_id = mp.project_id
      GROUP BY mpp.project_id) AS project_designer,
    ( -- get me all of the tags added to a project
    SELECT string_agg(tags.name, ', '::text) AS string_agg
      FROM moped_proj_tags ptags
        JOIN moped_tags tags ON ptags.tag_id = tags.id
      WHERE 1 = 1
        AND ptags.is_deleted = false
        AND ptags.project_id = mp.project_id
      GROUP BY ptags.project_id) AS project_tags,
    concat(added_by_user.first_name, ' ', added_by_user.last_name) AS added_by,
    mpcs.components
   FROM moped_project mp
     LEFT JOIN project_person_list_lookup ppll ON mp.project_id = ppll.project_id
     LEFT JOIN funding_sources_lookup fsl ON fsl.project_id = mp.project_id
     LEFT JOIN project_type_lookup ptl ON ptl.project_id = mp.project_id
     LEFT JOIN moped_entity me ON me.entity_id = mp.project_sponsor
     LEFT JOIN moped_entity mel ON mel.entity_id = mp.project_lead_id
     LEFT JOIN moped_proj_partners mpp2 ON mp.project_id = mpp2.project_id AND mpp2.is_deleted = false
     LEFT JOIN moped_entity me2 ON mpp2.entity_id = me2.entity_id
     LEFT JOIN work_activities on work_activities.project_id = mp.project_id
     LEFT JOIN moped_users added_by_user ON mp.added_by = added_by_user.user_id
     LEFT JOIN current_phase_view current_phase on mp.project_id = current_phase.project_id
     LEFT JOIN moped_public_process_statuses mpps ON mpps.id = mp.public_process_status_id
     LEFT JOIN child_project_lookup cpl on cpl.parent_id = mp.project_id
     LEFT JOIN moped_proj_components_subtypes mpcs on mpcs.project_id = mp.project_id
     LEFT JOIN LATERAL
      (
        SELECT mpn.project_note, mpn.date_created
        FROM moped_proj_notes mpn
        WHERE mpn.project_id = mp.project_id AND mpn.project_note_type = 2 AND mpn.is_deleted = false
        ORDER BY mpn.date_created DESC
        LIMIT 1
      ) as proj_status_update on true
  WHERE
    mp.is_deleted = false
  GROUP BY
    mp.project_id, 
    mp.project_name, 
    mp.project_description, 
    ppll.project_team_members, 
    mp.ecapris_subproject_id, 
    mp.date_added,
    mp.is_deleted,
    me.entity_name,
    mel.entity_name,
    mp.updated_at,
    mp.interim_project_id,
    mp.parent_project_id,
    mp.knack_project_id,
    current_phase.phase_name,
    current_phase.phase_key,
    current_phase.phase_name_simple,
    ptl.type_name,
    mpcs.components,
    fsl.funding_source_name,
    added_by_user.first_name,
    added_by_user.last_name,
    mpps.name,
    cpl.children_project_ids,
    proj_status_update.project_note,
    proj_status_update.date_created,
    work_activities.workgroup_contractors,
    work_activities.contract_numbers,
    work_activities.task_order_names,
    work_activities.task_order_names_short,
    work_activities.task_orders;

CREATE OR REPLACE VIEW component_arcgis_online_view AS (
    SELECT 
        mpc.project_id, 
        comp_geography.project_component_id, 
        comp_geography.feature_ids, 
        mpc.component_id, 
        comp_geography.geometry, 
        comp_geography.line_geometry,
        comp_geography.signal_ids, 
        council_districts.council_districts, 
        'placeholder text' as council_districts_searchable,
        CASE WHEN council_districts IS NULL OR council_districts = '' THEN FALSE
            ELSE TRUE
            END AS is_within_city_limits,
        comp_geography.length_feet_total, 
        round((comp_geography.length_feet_total / 5280::numeric),2) AS length_miles_total,
        mc.component_name, 
        mc.component_subtype, 
        mc.component_name_full, 
        'placeholder text' as component_categories,
        subcomponents.subcomponents as component_subcomponents, 
        work_types.work_types as component_work_types, 
        component_tags.component_tags, 
        mpc.description AS component_description,
        mpc.interim_project_component_id, 
        mpc.completion_date,
        COALESCE(mpc.completion_date, substantial_completion_date) as substantial_completion_date,
        '2024-01-01T00:00:00−06:00' as substantial_completion_date_estimated,
        mpc.srts_id, 
        mpc.location_description as component_location_description, 
        plv.project_name,
        'placeholder text' as project_name_descriptor,
        'placeholder text' as project_name_with_descriptor,
        plv.project_description, 
        plv.ecapris_subproject_id, 
        plv.project_website,
        plv.updated_at as project_updated_at, 
        mpc.phase_id AS component_phase_id, 
        mph.phase_name AS component_phase_name, 
        mph.phase_name_simple as component_phase_name_simple, 
        current_phase.phase_id AS project_phase_id, 
        current_phase.phase_name AS project_phase_name, 
        current_phase.phase_name_simple AS project_phase_name_simple, 
        COALESCE(mph.phase_name, current_phase.phase_name) AS current_phase_name, 
        COALESCE(mph.phase_name_simple, current_phase.phase_name_simple) AS current_phase_name_simple, 
        plv.project_team_members, 
        plv.project_sponsor, 
        plv.project_lead, 
        plv.public_process_status, 
        plv.interim_project_id, 
        plv.project_partner as project_partners, 
        plv.task_order_names, 
        plv.funding_source_name, 
        plv.type_name, 
        plv.project_status_update,  
        plv.project_status_update_date_created, 
        plv.construction_start_date, 
        plv.completion_end_date, 
        plv.project_inspector, 
        plv.project_designer, 
        plv.project_tags, 
        plv.workgroup_contractors, 
        plv.contract_numbers, 
        999999 as parent_project_id,
        'placeholder text' as parent_project_url,
        'placeholder text' as parent_project_name,
        'placeholder text' as parent_project_name_with_descriptor,
        'placeholder text' as related_project_ids,
        'placeholder text' as related_project_ids_searchable,
        plv.knack_project_id as knack_data_tracker_project_record_id, 
        'https://mobility.austin.gov/moped/projects/' || plv.project_id :: text as project_url, 
        'https://mobility.austin.gov/moped/projects/' || plv.project_id :: text || '?tab=map&project_component_id=' || mpc.project_component_id :: text as component_url, 
        plv.work_plan_category,
        plv.work_plan_category_date,
        plv.work_plan_category_date_calendar_year,
        plv.work_plan_category_date_calendar_year_month,
        plv.work_plan_category_date_calendar_year_month_numeric,
        plv.work_plan_category_date_calendar_year_quarter,
        plv.work_plan_category_date_fiscal_year,
        plv.work_plan_category_date_fiscal_year_quarter,
        added_by as project_added_by
    FROM 
        moped_proj_components mpc 
    LEFT JOIN (
    -- group feature properties by project component ID
        SELECT 
            component_id AS project_component_id, 
            STRING_AGG(DISTINCT id :: text, ', ') AS feature_ids, 
            ST_AsGeoJSON(
            ST_Union(
                ARRAY_AGG(geography)
            )
            ):: json AS "geometry", 
            ST_AsGeoJSON(
            ST_Union(
                ARRAY_AGG(line_geography)
            )
            ):: json AS "line_geometry", 
            STRING_AGG(DISTINCT signal_id :: text, ', ') AS signal_ids, 
            SUM(length_feet) as length_feet_total 
        FROM 
            (
            -- union all features
            SELECT 
                id, 
                feature_signals.component_id, 
                feature_signals.geography :: geometry, 
                ST_ExteriorRing(
                    ST_Buffer(feature_signals.geography, 7):: geometry
                ) AS line_geography, 
                feature_signals.signal_id, 
                NULL AS length_feet 
            FROM 
                feature_signals 
            WHERE 
                feature_signals.is_deleted = FALSE 
            UNION ALL 
            SELECT 
                id, 
                feature_street_segments.component_id, 
                feature_street_segments.geography :: geometry, 
                feature_street_segments.geography :: geometry as line_geography, 
                NULL AS signal_id, 
                length_feet 
            FROM 
                feature_street_segments 
            WHERE 
                feature_street_segments.is_deleted = FALSE 
            UNION ALL 
            SELECT 
                id, 
                feature_intersections.component_id, 
                feature_intersections.geography :: geometry, 
                ST_ExteriorRing(
                    ST_Buffer(feature_intersections.geography, 7):: geometry
                ) AS line_geography, 
                NULL AS signal_id, 
                NULL AS length_feet 
            FROM 
                feature_intersections 
            WHERE 
                feature_intersections.is_deleted = FALSE 
            UNION ALL 
            SELECT 
                id, 
                feature_drawn_points.component_id, 
                feature_drawn_points.geography :: geometry, 
                ST_ExteriorRing(
                    ST_Buffer(feature_drawn_points.geography, 7):: geometry
                ) AS line_geography, 
                NULL AS signal_id, 
                NULL AS length_feet 
            FROM 
                feature_drawn_points 
            WHERE 
                feature_drawn_points.is_deleted = FALSE 
            UNION ALL 
            SELECT 
                id, 
                feature_drawn_lines.component_id, 
                feature_drawn_lines.geography :: geometry,
                feature_drawn_lines.geography :: geometry as line_geography, 
                NULL AS signal_id, 
                length_feet 
            FROM 
                feature_drawn_lines 
            WHERE 
                feature_drawn_lines.is_deleted = FALSE
            ) feature_union 
        GROUP BY 
            component_id
        ) comp_geography ON comp_geography.project_component_id = mpc.project_component_id 
        LEFT JOIN (
        -- group council districts by project component id
        SELECT 
            component_id AS project_component_id, 
            STRING_AGG(
            DISTINCT council_district_id :: text, 
            ', '
            ) AS council_districts 
        FROM 
            features_council_districts 
            LEFT JOIN features ON features.id = features_council_districts.feature_id 
        WHERE 
            features.is_deleted = FALSE 
        GROUP BY 
            component_id
        ) council_districts ON council_districts.project_component_id = mpc.project_component_id 
        LEFT JOIN (
        -- group subcomponents by project component id
        SELECT 
            project_component_id, 
            string_agg(ms.subcomponent_name, ', ') subcomponents 
        FROM 
            moped_proj_components_subcomponents mpcs 
            LEFT JOIN moped_subcomponents ms ON mpcs.subcomponent_id = ms.subcomponent_id
            WHERE mpcs.is_deleted = FALSE
        GROUP BY 
            project_component_id
        ) subcomponents ON subcomponents.project_component_id = mpc.project_component_id 
        LEFT JOIN (
        -- group work types by project component id
        SELECT 
            project_component_id, 
            string_agg(mwt.name, ', ') work_types 
        FROM 
            moped_proj_component_work_types mpcwt 
            LEFT JOIN moped_work_types mwt ON mpcwt.work_type_id = mwt.id 
            WHERE mpcwt.is_deleted = FALSE
        GROUP BY 
            project_component_id
        ) work_types ON work_types.project_component_id = mpc.project_component_id 
        LEFT JOIN (
        -- group project component tags by project component id
        SELECT 
            project_component_id, 
            string_agg(mct.type || ' - ' || mct.name, ', ') component_tags 
        FROM 
            moped_proj_component_tags mpct 
            LEFT JOIN moped_component_tags mct ON mpct.component_tag_id = mct.id
            WHERE mpct.is_deleted = FALSE
        GROUP BY 
            project_component_id
        ) component_tags ON component_tags.project_component_id = mpc.project_component_id 
    LEFT JOIN project_list_view plv ON plv.project_id = mpc.project_id 
    LEFT JOIN current_phase_view current_phase ON mpc.project_id = current_phase.project_id 
    LEFT JOIN moped_phases mph ON mpc.phase_id = mph.phase_id 
    LEFT JOIN moped_components mc ON mc.component_id = mpc.component_id 
WHERE 
    mpc.is_deleted = FALSE 
    AND plv.is_deleted = FALSE
);
