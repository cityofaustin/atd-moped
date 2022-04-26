drop view project_list_view;

CREATE VIEW public.project_list_view AS
with moped_team_members as (
  select
    mpp.project_id,
    string_agg(DISTINCT concat(mu.first_name, ' ', mu.last_name, ':', mpr.project_role_name), ',') AS project_team_members
   FROM 
    public.moped_proj_personnel mpp
        LEFT JOIN public.moped_users mu ON ((mpp.user_id = mu.user_id))
        LEFT JOIN public.moped_project_roles mpr ON ((mpp.role_id = mpr.project_role_id))
      where (mpp.status_id = 1)
      group by mpp.project_id
),
 moped_funding_sources as (
  select
    mpf.project_id,
    string_agg(mfs.funding_source_name, ', ') as funding_source_name
  from
    moped_proj_funding mpf
    left join moped_fund_sources mfs on mpf.funding_source_id = mfs.funding_source_id
    group by mpf.project_id
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
    mtm.project_team_members,
    me.entity_name AS project_sponsor,
    string_agg(DISTINCT me2.entity_name, ', ') AS project_partner,
        CASE
            WHEN ((mp.status_id = 0) OR (mp.status_id IS NULL)) THEN NULL::text
            WHEN (mp.status_id = 1) THEN mp.current_phase
            ELSE mp.current_status
        END AS status_name,
    string_agg(task_order_filter->>'display_name', ',') as task_order_name,
    mp.contractor,
    mp.purchase_order_number,
    json_agg(mpf.feature) as project_feature,
    mt.type_name,
    mfs.funding_source_name
   FROM public.moped_project mp
   left join moped_team_members mtm on mp.project_id = mtm.project_id
      left join moped_funding_sources mfs on mfs.project_id = mp.project_id
     LEFT JOIN public.moped_entity me ON me.entity_id = mp.project_sponsor
     LEFT JOIN public.moped_proj_partners mpp2 ON (mp.project_id = mpp2.project_id AND mpp2.status_id = 1)
     LEFT JOIN public.moped_entity me2 ON mpp2.entity_id = me2.entity_id
     left join jsonb_array_elements(mp.task_order) as task_order_filter on true
     left join moped_proj_components mpc on mpc.project_id = mp.project_id and mpc.status_id = 1
     left join moped_proj_features mpf on mpc.project_component_id = mpf.project_component_id
     left join public.moped_project_types mpt on mpt.project_id = mp.project_id
     left join public.moped_types mt on mpt.project_type_id = mt.type_id
  GROUP BY mp.project_uuid,
    mp.project_id,
    mp.project_name,
    mp.project_description,
    mtm.project_team_members,
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
    mt.type_name,
    mfs.funding_source_name;
