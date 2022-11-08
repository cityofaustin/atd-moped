DROP VIEW project_list_view;

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
  )
 SELECT
    mp.project_uuid,
    mp.project_id,
    mp.project_name,
    mp.project_description,
    mp.project_description_public,
    mp.ecapris_subproject_id,
    mp.project_order,
    mp.current_status,
    mp.timeline_id,
    mp.current_phase,
    mp.end_date,
    mp.project_length,
    mp.fiscal_year,
    mp.capitally_funded,
    mp.date_added,
    mp.is_deleted,
    mp.milestone_id,
    mp.task_order,
    COALESCE(mp.status_id, 0) AS status_id,
    mp.updated_at,
    ppll.project_team_members,
    me.entity_name AS project_sponsor,
    mel.entity_name AS project_lead,
    string_agg(DISTINCT me2.entity_name, ', '::text) AS project_partner,
    CASE
        WHEN mp.status_id = 0 OR mp.status_id IS NULL THEN NULL::text
        WHEN mp.status_id = 1 THEN mp.current_phase
        ELSE mp.current_status
    END AS status_name,
    string_agg(task_order_filter.value ->> 'display_name'::text, ','::text) AS task_order_name,
    COALESCE( -- coalesce because this subquery can come back 'null' if there are no component assets
      ( SELECT JSON_AGG(features.feature) -- this query finds any components and those component's features and rolls them up in a JSON blob
        FROM moped_proj_components components   
        LEFT JOIN moped_proj_features features 
          ON (features.project_component_id = components.project_component_id)
        WHERE TRUE
          AND components.is_deleted = false
          AND components.project_id = mp.project_id
        ),
      '{}'::json) as project_feature, -- close out that coalesce; if null, give us a empty json object
    fsl.funding_source_name,
    ptl.type_name,
    ( -- get the most recent status_update (project note type 2)
      SELECT mpn.project_note
      FROM moped_proj_notes mpn
        WHERE mpn.project_id = mp.project_id AND mpn.project_note_type = 2 AND mpn.is_deleted = false
        ORDER BY mpn.date_created DESC
        LIMIT 1) AS project_note,
    ( -- get me the phase start of the most recently added construction phase entry
      SELECT phases.phase_start
      FROM moped_proj_phases phases
      WHERE true
        AND phases.project_id = mp.project_id 
        AND phases.phase_id = 9 -- phase_id 9 is construction
        AND phases.is_deleted = false
      ORDER BY phases.date_added DESC
      LIMIT 1) AS construction_start_date,
    ( -- get me the phase end of the most recently added completion phase entry
      SELECT phases.phase_end
      FROM moped_proj_phases phases
      WHERE true 
        AND phases.project_id = mp.project_id 
        AND phases.phase_id = 11 -- phase_id 11 is complete
        AND phases.is_deleted = false
      ORDER BY phases.date_added DESC
      LIMIT 1) AS completion_end_date,
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
    ( -- get me all of the contractors added to a project
      SELECT string_agg(contract.contractor, ', ' :: text) AS string_agg
      FROM moped_proj_contract contract
      WHERE 1 = 1
      AND contract.is_deleted = FALSE
      AND contract.project_id = mp.project_id
      GROUP BY
      contract.project_id) AS contractors,
    ( -- get me all of the contract numbers added to a project
      SELECT
        string_agg(
            contract.contract_number, ', ' :: text
        ) AS string_agg
      FROM moped_proj_contract contract
      WHERE 1 = 1
        AND contract.is_deleted = FALSE
        AND contract.project_id = mp.project_id
      GROUP BY contract.project_id) AS contract_numbers,
    concat(added_by_user.first_name, ' ', added_by_user.last_name) AS added_by
   FROM moped_project mp
     LEFT JOIN project_person_list_lookup ppll ON mp.project_id = ppll.project_id
     LEFT JOIN funding_sources_lookup fsl ON fsl.project_id = mp.project_id
     LEFT JOIN project_type_lookup ptl ON ptl.project_id = mp.project_id
     LEFT JOIN moped_entity me ON me.entity_id = mp.project_sponsor
     LEFT JOIN moped_entity mel ON mel.entity_id = mp.project_lead_id
     LEFT JOIN moped_proj_partners mpp2 ON mp.project_id = mpp2.project_id AND mpp2.is_deleted = false
     LEFT JOIN moped_entity me2 ON mpp2.entity_id = me2.entity_id
     LEFT JOIN LATERAL jsonb_array_elements(mp.task_order) task_order_filter(value) ON true
     LEFT JOIN moped_proj_contract contracts ON (mp.project_id = contracts.project_id) AND contracts.is_deleted = false
     LEFT JOIN moped_users added_by_user ON mp.added_by = added_by_user.user_id
  GROUP BY mp.project_uuid, 
    mp.project_id, 
    mp.project_name, 
    mp.project_description, 
    ppll.project_team_members, 
    mp.project_description_public, 
    mp.ecapris_subproject_id, 
    mp.project_order, 
    mp.current_status, 
    mp.timeline_id, 
    mp.current_phase, 
    mp.end_date, 
    mp.fiscal_year, 
    mp.capitally_funded, 
    mp.date_added,
    mp.is_deleted, 
    mp.milestone_id, 
    mp.status_id, 
    me.entity_name,
    mel.entity_name,
    mp.updated_at, 
    mp.task_order,
    ptl.type_name, 
    fsl.funding_source_name,
    added_by_user.first_name,
    added_by_user.last_name;
