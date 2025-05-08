-- Remove should_sync_ecapris_statuses column from moped_project table 
ALTER TABLE moped_project
DROP COLUMN should_sync_ecapris_statuses;

-- Drop ecapris_status_updates table
DROP TABLE IF EXISTS public.ecapris_subproject_statuses;

-- Drop function to match user email and set created_by_user_id
DROP FUNCTION IF EXISTS public.find_user_match_by_email;
