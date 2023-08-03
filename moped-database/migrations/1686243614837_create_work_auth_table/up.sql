-- temporarily disable event triggers
SET session_replication_role = replica;

CREATE TABLE moped_proj_work_activity_status (
    id serial PRIMARY KEY,
    key text UNIQUE,
    name text,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO moped_proj_work_activity_status (key, name) VALUES 
  ('planned', 'Planned'),
  ('under_construction', 'Under construction'),
  ('complete', 'Complete'),
  ('canceled', 'Canceled'),
  ('on_hold', 'On hold');

ALTER TABLE moped_proj_contract RENAME TO moped_proj_work_activity;

ALTER TABLE moped_proj_work_activity
    ADD COLUMN interim_work_order_id_old text,
    ADD COLUMN implementation_workgroup text,
    ADD COLUMN task_orders jsonb,
    ADD COLUMN status_id integer NOT NULL DEFAULT 1,
    ADD COLUMN status_note text,
    ADD COLUMN created_by_user_id integer,
    ADD COLUMN created_at timestamp WITH time zone NOT NULL DEFAULT now(),
    ADD COLUMN updated_by_user_id integer,
    ADD COLUMN updated_at timestamp WITH time zone NOT NULL DEFAULT now(),
    ADD CONSTRAINT status_id_fkey FOREIGN KEY (status_id)
        REFERENCES moped_proj_work_activity_status (id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    ADD CONSTRAINT created_by_user_fkey FOREIGN KEY (created_by_user_id)
        REFERENCES moped_users (user_id)
        ON UPDATE CASCADE ON DELETE SET NULL, 
    ADD CONSTRAINT updated_by_user_fkey FOREIGN KEY (updated_by_user_id)
        REFERENCES moped_users (user_id)
        ON UPDATE CASCADE ON DELETE SET NULL;

-- rename moped_proj_contact activity log entry names
UPDATE moped_activity_log SET record_type = 'moped_proj_work_activity'
    WHERE record_type = 'moped_proj_contract';

-- backfill created_by, created_at, updated_at from activity log
UPDATE
    moped_proj_work_activity
SET
    created_at = work_activity_insert_event.created_at,
    updated_at = work_activity_insert_event.created_at,
    created_by_user_id = work_activity_insert_event.updated_by_user_id,
    updated_by_user_id = work_activity_insert_event.updated_by_user_id
FROM (
    SELECT
        record_id,
        created_at,
        updated_by_user_id
    FROM
        moped_activity_log
    WHERE
        record_type = 'moped_proj_work_activity'
        AND operation_type = 'INSERT') AS work_activity_insert_event
WHERE
    moped_proj_work_activity.id = work_activity_insert_event.record_id;

-- backfill updated_at, updated_by based on most recent activity log
-- update event (if one exists)
UPDATE moped_proj_work_activity
SET
    updated_at = work_activity_update_event.created_at,
    updated_by_user_id = work_activity_update_event.updated_by_user_id
    FROM (
SELECT DISTINCT ON (record_id)
    record_id,
    created_at,
    updated_by_user_id
FROM
    moped_activity_log
WHERE
    operation_type = 'UPDATE' AND
    record_type = 'moped_proj_work_activity'
ORDER BY
    record_id,
    created_at DESC)  AS work_activity_update_event
WHERE
    moped_proj_work_activity.id = work_activity_update_event.record_id;

-- create trigger to manage updated_at timestamp
CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ BEGIN NEW.updated_at := NOW();
RETURN NEW;
END;
$$;

CREATE TRIGGER set_proj_work_activity_trigger_updated_at BEFORE UPDATE ON public.moped_proj_work_activity FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- renable event triggers
SET session_replication_role = DEFAULT;

-- rebuild project list view
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
    mp.project_id,
    mp.project_name,
    mp.project_description,
    mp.ecapris_subproject_id,
    mp.date_added,
    mp.is_deleted,
    mp.task_order,
    mp.updated_at,
    current_phase.phase_name as current_phase,
    current_phase.phase_key as current_phase_key,
    ppll.project_team_members,
    me.entity_name AS project_sponsor,
    mel.entity_name AS project_lead,
    mpps.name AS public_process_status,
    mp.interim_project_id,
    string_agg(DISTINCT me2.entity_name, ', '::text) AS project_partner,
    string_agg(task_order_filter.value ->> 'display_name'::text, ','::text) AS task_order_name,
    (SELECT JSON_AGG(feature.attributes) -- this query finds any signal components and those component's features and rolls them up in a JSON blob
        FROM moped_proj_components components   
        LEFT JOIN uniform_features feature
          ON (feature.component_id = components.project_component_id)
        WHERE TRUE
          AND components.is_deleted = false
          AND components.project_id = mp.project_id
          AND feature.table = 'feature_signals'
        ) as project_feature,
    fsl.funding_source_name,
    ptl.type_name,
    ( -- get the most recent status_update (project note type 2)
      SELECT mpn.project_note
      FROM moped_proj_notes mpn
        WHERE mpn.project_id = mp.project_id AND mpn.project_note_type = 2 AND mpn.is_deleted = false
        ORDER BY mpn.date_created DESC
        LIMIT 1) AS project_note,
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
      FROM moped_proj_work_activity contract
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
      FROM moped_proj_work_activity contract
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
     LEFT JOIN moped_proj_work_activity contracts ON (mp.project_id = contracts.project_id) AND contracts.is_deleted = false
     LEFT JOIN moped_users added_by_user ON mp.added_by = added_by_user.user_id
     LEFT JOIN current_phase_view current_phase on mp.project_id = current_phase.project_id
     LEFT JOIN moped_public_process_statuses mpps ON mpps.id = mp.public_process_status_id 
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
    mp.task_order,
    mp.interim_project_id,
    current_phase.phase_name,
    current_phase.phase_key,
    ptl.type_name, 
    fsl.funding_source_name,
    added_by_user.first_name,
    added_by_user.last_name,
    mpps.name;
