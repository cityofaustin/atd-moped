DROP TABLE IF EXISTS public.files_project_work_activities;

ALTER TABLE moped_proj_components DROP CONSTRAINT IF EXISTS fk_created_by_user_id;
ALTER TABLE moped_proj_components DROP CONSTRAINT IF EXISTS fk_updated_by_user_id;
ALTER TABLE moped_proj_milestones DROP CONSTRAINT IF EXISTS fk_created_by_user_id;
ALTER TABLE moped_proj_milestones DROP CONSTRAINT IF EXISTS fk_updated_by_user_id;
ALTER TABLE moped_proj_notes DROP CONSTRAINT IF EXISTS fk_updated_by_user_id;
