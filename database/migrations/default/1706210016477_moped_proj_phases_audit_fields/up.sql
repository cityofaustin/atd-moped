ALTER TABLE moped_proj_phases RENAME COLUMN date_added TO created_at;

ALTER TABLE moped_proj_phases
    ADD COLUMN created_by_user_id INTEGER
        CONSTRAINT created_by_user_fkey REFERENCES moped_users (user_id);

ALTER TABLE moped_proj_phases
    ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE moped_proj_phases
    ADD COLUMN updated_by_user_id INTEGER
    CONSTRAINT updated_by_user_fkey REFERENCES moped_users (user_id);

COMMENT ON COLUMN moped_proj_phases.updated_at IS 'Timestamp when the record was last updated';

COMMENT ON COLUMN moped_proj_phases.updated_by_user_id IS 'ID of the user who last updated the record';

CREATE TRIGGER update_moped_proj_phases_and_project_audit_fields
    BEFORE INSERT
    OR UPDATE ON moped_proj_phases
    FOR EACH ROW
    EXECUTE FUNCTION public.update_self_and_project_updated_audit_fields ();

COMMENT ON TRIGGER update_moped_proj_phases_and_project_audit_fields ON moped_proj_phases IS 'Trigger to execute the update_self_and_project_updated_audit_fields function before each update operation on the moped_proj_phases table.';
