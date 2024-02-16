ALTER TABLE public.moped_proj_notes RENAME COLUMN created_at TO date_created;
ALTER TABLE public.moped_proj_notes RENAME COLUMN created_at TO date_added;
ALTER TABLE public.moped_proj_notes DROP COLUMN created_by_user_id;
ALTER TABLE public.moped_proj_notes DROP COLUMN updated_at;
ALTER TABLE public.moped_proj_notes DROP COLUMN updated_by_user_id;

DROP TRIGGER update_moped_proj_notes_and_project_audit_fields ON moped_proj_notes;
