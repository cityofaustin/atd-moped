DROP VIEW project_list_view;

CREATE VIEW public.project_list_view AS
with project_person_list_lookup as (
  SELECT
    mpp.project_id,
    string_agg(DISTINCT concat(mu.first_name, ' ', mu.last_name, ':', mpr.project_role_name), ',') AS project_team_members
   FROM 
    public.moped_proj_personnel mpp
        JOIN public.moped_users mu ON mpp.user_id = mu.user_id
        JOIN public.moped_project_roles mpr ON mpp.role_id = mpr.project_role_id
      WHERE (mpp.status_id = 1)
      GROUP BY mpp.project_id
),
 funding_sources_lookup AS (
  SELECT
    mpf.project_id,
    string_agg(mfs.funding_source_name, ', ') AS funding_source_name
  FROM
    moped_proj_funding mpf
    LEFT JOIN moped_fund_sources mfs ON mpf.funding_source_id = mfs.funding_source_id
    WHERE mpf.funding_status_id = 1
    GROUP BY mpf.project_id
),
project_type_lookup as (
  SELECT
    mpt.project_id,
    string_agg(mt.type_name, ', ') as type_name
  FROM
     public.moped_project_types mpt
     LEFT JOIN public.moped_types mt ON mpt.project_type_id = mt.type_id AND mpt.status_id = 1
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
    mp.added_by,
    mp.is_retired,
    mp.milestone_id,
    mp.task_order,
    COALESCE(mp.status_id, 0) AS status_id,
    mp.updated_at,
    ppll.project_team_members,
    me.entity_name AS project_sponsor,
    string_agg(DISTINCT me2.entity_name, ', ') AS project_partner,
    CASE
      WHEN (mp.status_id = 0 OR mp.status_id IS NULL) THEN NULL::text
      WHEN (mp.status_id = 1) THEN mp.current_phase
      ELSE mp.current_status
    END AS status_name,
    string_agg(task_order_filter->>'display_name', ',') as task_order_name,
    mp.contractor,
    mp.purchase_order_number,
    json_agg(mpf.feature) as project_feature,
    fsl.funding_source_name,
    ptl.type_name,
  ( -- get the most recent status_update (project note type 2)
    SELECT mpn.project_note FROM moped_proj_notes mpn
    WHERE mpn.project_id = mp.project_id and mpn.project_note_type = 2 and mpn.status_id = 1
    ORDER BY mpn.date_created desc
    LIMIT 1) as project_note,
  ( -- get me the phase start of the most recently added construction phase entry
    SELECT phases.phase_start
    FROM moped_proj_phases phases
    WHERE 1 = 1
      and phases.project_id = mp.project_id
      and phases.phase_name = 'construction'
    ORDER BY phases.date_added desc
    LIMIT 1
  )::date AS construction_start_date,
  ( -- get me the phase end of the most recently added completion phase entry
    SELECT phases.phase_end
    FROM moped_proj_phases phases
    WHERE 1 = 1
      and phases.project_id = mp.project_id
      and phases.phase_name = 'complete'
    ORDER BY phases.date_added desc
    LIMIT 1
  )::date AS completion_end_date,
  ( -- get me a list of the inspectors for this project
    select string_agg(concat(users.first_name, ' ', users.last_name), ', ')
    from moped_proj_personnel personnel
    join moped_users users on (personnel.user_id = users.user_id)
    join moped_project_roles roles ON personnel.role_id = roles.project_role_id
    where 1 = 1
      and roles.project_role_name = 'Inspector'
      and personnel.status_id = 1
      and personnel.project_id = mp.project_id
   group by personnel.project_id) as project_inspector,
  ( -- get me a list of the designers for this project
    select string_agg(concat(users.first_name, ' ', users.last_name), ', ')
    from moped_proj_personnel personnel
    join moped_users users on (personnel.user_id = users.user_id)
    join moped_project_roles roles ON personnel.role_id = roles.project_role_id
    where 1 = 1
      and roles.project_role_name = 'Designer'
      and personnel.status_id = 1
      and personnel.project_id = mp.project_id
    group by personnel.project_id) as project_designer
   FROM public.moped_project mp
     LEFT JOIN project_person_list_lookup ppll ON mp.project_id = ppll.project_id
     LEFT JOIN funding_sources_lookup fsl ON fsl.project_id = mp.project_id
     LEFT JOIN project_type_lookup ptl ON ptl.project_id = mp.project_id
     LEFT JOIN public.moped_entity me ON me.entity_id = mp.project_sponsor
     LEFT JOIN public.moped_proj_partners mpp2 ON (mp.project_id = mpp2.project_id AND mpp2.status_id = 1)
     LEFT JOIN public.moped_entity me2 ON mpp2.entity_id = me2.entity_id
     LEFT JOIN jsonb_array_elements(mp.task_order) as task_order_filter ON true
     LEFT JOIN moped_proj_components mpc ON mpc.project_id = mp.project_id and mpc.status_id = 1
     LEFT JOIN moped_proj_features mpf ON mpc.project_component_id = mpf.project_component_id
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
    mp.added_by,
    mp.is_retired,
    mp.milestone_id,
    mp.status_id,
    me.entity_name,
    mp.updated_at,
    mp.task_order,
    mp.contractor,
    mp.purchase_order_number,
    ptl.type_name,
    fsl.funding_source_name;
