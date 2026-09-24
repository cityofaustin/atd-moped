-- Adds audit columns and trigger to moped_proj_tags
ALTER TABLE moped_proj_tags
ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
ADD COLUMN created_by_user_id INTEGER NULL,
ADD COLUMN updated_by_user_id INTEGER NULL,
ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

COMMENT ON COLUMN moped_proj_tags.created_by_user_id IS 'ID of the user who created the record';
COMMENT ON COLUMN moped_proj_tags.created_at IS 'Timestamp when the record was created';
COMMENT ON COLUMN moped_proj_tags.updated_by_user_id IS 'ID of the user who last updated the record';
COMMENT ON COLUMN moped_proj_tags.updated_at IS 'Timestamp when the record was last updated';

-- Add fk constraints on user audit fields
ALTER TABLE moped_proj_tags
ADD CONSTRAINT project_tags_created_by_fkey FOREIGN KEY (created_by_user_id) REFERENCES moped_users (user_id),
ADD CONSTRAINT project_tags_updated_by_fkey FOREIGN KEY (updated_by_user_id) REFERENCES moped_users (user_id);

CREATE TRIGGER update_moped_proj_tags_and_project_audit_fields
BEFORE INSERT
OR UPDATE ON moped_proj_tags
FOR EACH ROW
EXECUTE FUNCTION public.update_self_and_project_updated_audit_fields();

COMMENT ON TRIGGER update_moped_proj_tags_and_project_audit_fields ON moped_proj_tags IS 'Trigger to execute the update_self_and_project_updated_audit_fields function before each update operation on the moped_proj_tags table.';
