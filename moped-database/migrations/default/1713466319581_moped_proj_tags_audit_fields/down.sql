ALTER TABLE moped_proj_tags DROP COLUMN created_at, DROP COLUMN created_by_user_id, DROP COLUMN updated_at, DROP COLUMN updated_by_user_id;

DROP TRIGGER update_moped_proj_tags_and_project_audit_fields ON moped_proj_tags;
