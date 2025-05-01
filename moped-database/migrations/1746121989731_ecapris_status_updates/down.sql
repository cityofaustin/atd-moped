-- Remove should_sync_ecapris_statuses column from moped_project table 
ALTER TABLE moped_project
DROP COLUMN should_sync_ecapris_statuses;

-- Drop ecapris_status_updates table
DROP TABLE IF EXISTS public.ecapris_subproject_statuses;

-- Drop trigger for updated_at column
DROP TRIGGER IF EXISTS set_ecapris_subproject_statuses_updated_at ON public.ecapris_subproject_statuses;
