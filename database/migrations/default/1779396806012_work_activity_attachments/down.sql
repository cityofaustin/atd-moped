DROP TABLE IF EXISTS public.files_project_work_activities;

-- Drop foreign key constraints for created_by_user_id and updated_by_user_id before dropping the tables they reference
-- Updates from user id 29 to 1 in updated_by_user_id columns in the up migration are one-way and cannot be reversed.
ALTER TABLE moped_proj_components DROP CONSTRAINT IF EXISTS fk_created_by_user_id;
ALTER TABLE moped_proj_components DROP CONSTRAINT IF EXISTS fk_updated_by_user_id;
ALTER TABLE moped_proj_milestones DROP CONSTRAINT IF EXISTS fk_created_by_user_id;
ALTER TABLE moped_proj_milestones DROP CONSTRAINT IF EXISTS fk_updated_by_user_id;
ALTER TABLE moped_proj_notes DROP CONSTRAINT IF EXISTS fk_updated_by_user_id;
