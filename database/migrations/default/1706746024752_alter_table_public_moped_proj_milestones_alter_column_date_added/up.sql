ALTER TABLE moped_proj_milestones RENAME COLUMN date_added TO created_at;
ALTER TABLE moped_proj_milestones ADD COLUMN created_by_user_id INTEGER
 NULL;
ALTER TABLE moped_proj_milestones ADD COLUMN updated_at TIMESTAMPTZ
 NULL;
ALTER TABLE moped_proj_milestones ADD COLUMN updated_by_user_id INTEGER
 NULL;

COMMENT ON COLUMN moped_proj_milestones.updated_at IS 'Timestamp when the record was last updated';
COMMENT ON COLUMN moped_proj_milestones.updated_by_user_id IS 'ID of the user who last updated the record';

CREATE TRIGGER update_moped_proj_milestones_and_project_audit_fields
BEFORE INSERT OR UPDATE ON moped_proj_milestones
FOR EACH ROW
EXECUTE FUNCTION public.update_self_and_project_updated_audit_fields();

COMMENT ON TRIGGER update_moped_proj_milestones_and_project_audit_fields ON moped_proj_milestones IS 'Trigger to execute the update_self_and_project_updated_audit_fields function before each update operation on the moped_proj_milestones table.';
