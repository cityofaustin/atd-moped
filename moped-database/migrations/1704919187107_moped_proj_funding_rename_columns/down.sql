-- DROP TRIGGER set_updated_at_before_update ON moped_proj_funding;

ALTER TABLE moped_proj_funding DROP COLUMN updated_at;
ALTER TABLE moped_proj_funding DROP COLUMN updated_by_user_id;

ALTER TABLE moped_proj_funding RENAME COLUMN created_at TO date_added;
ALTER TABLE moped_proj_funding RENAME COLUMN created_by_user_id TO added_by;

DROP TRIGGER update_self_and_project_audit_fields_audit_fields ON moped_proj_funding;
DROP FUNCTION public.update_self_and_project_updated_audit_fields();