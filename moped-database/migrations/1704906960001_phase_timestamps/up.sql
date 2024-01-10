-- this migration makes the `moped_proj_phases` timezone aware and corrects the existing date
-- values which are in central time but stored as UTC

-- we must drop dependent views to change the column types :/
DROP VIEW IF EXISTS component_arcgis_online_view;
DROP VIEW IF EXISTS project_list_view;

-- change column types to be timezone aware
ALTER TABLE moped_proj_phases
  ALTER COLUMN phase_start TYPE timestamp WITH time zone,
  ALTER COLUMN phase_end TYPE timestamp WITH time zone;

-- disable event triggers and assign timezone to all existing dates
SET session_replication_role = replica;
UPDATE
    moped_proj_phases
SET
    phase_start = dates_to_fix.phase_start,
    phase_end = dates_to_fix.phase_end
FROM (
    SELECT
        project_id,
        phase_start AT TIME ZONE 'UTC' AT TIME ZONE 'America/Chicago' AS phase_start,
        phase_end AT TIME ZONE 'UTC' AT TIME ZONE 'America/Chicago' AS phase_end
    FROM
        moped_proj_phases) AS dates_to_fix
WHERE
    moped_proj_phases.project_id = subquery.project_id;

-- rebuild dropped views
