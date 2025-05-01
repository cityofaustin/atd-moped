-- Remove should_sync_ecapris_statuses column from moped_project table 
ALTER TABLE moped_project
DROP COLUMN should_sync_ecapris_statuses;

-- Drop ecapris_status_updates table
DROP TABLE IF EXISTS public.ecapris_subproject_statuses;
