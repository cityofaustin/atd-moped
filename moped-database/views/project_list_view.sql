-- latest version 1706897389736_fix_sub_comp_date_dash
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
    'https://mobility.austin.gov/moped/projects/' || mp.project_id :: text as project_url, 
    'https://mobility.austin.gov/moped/projects/' || mp.parent_project_id :: text as parent_project_url, 
    proj_status_update.project_note as project_status_update,
    proj_status_update.date_created as project_status_update_date_created,
    work_activities.workgroup_contractors,
    work_activities.contract_numbers,
    work_activities.task_order_names,
    work_activities.task_order_names_short,
    work_activities.task_orders,
    'placeholder text' as project_development_status,
    '2024-01-01T00:00:00-06:00' as project_development_status_date,
    9999 as project_development_status_date_calendar_year,
    'placeholder text' as project_development_status_date_calendar_year_month,
    'placeholder text' as project_development_status_date_calendar_year_month_numeric,
    'placeholder text' as project_development_status_date_calendar_year_quarter,
    999 as project_development_status_date_fiscal_year,
    'placeholder text' as project_development_status_date_fiscal_year_quarter,
    (SELECT project_name
      FROM moped_project
      WHERE project_id = mp.parent_project_id
    ) as parent_project_name,
    cpl.children_project_ids,
    string_agg(DISTINCT me2.entity_name, ', '::text) AS project_partners,
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
