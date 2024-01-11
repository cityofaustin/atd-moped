ALTER TABLE moped_proj_funding RENAME COLUMN date_added TO created_at;
ALTER TABLE moped_proj_funding RENAME COLUMN added_by TO created_by_user_id;

ALTER TABLE moped_proj_funding ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE moped_proj_funding ADD COLUMN updated_by_user_id INTEGER;

COMMENT ON COLUMN moped_proj_funding.updated_at IS 'Timestamp when the record was last updated';
COMMENT ON COLUMN moped_proj_funding.updated_by_user_id IS 'ID of the user who last updated the record';

CREATE OR REPLACE FUNCTION public.update_self_and_project_updated_audit_fields() RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update the updated_at field in the current row of the triggering table
    NEW.updated_at := NOW();

    -- Update the updated_at and updated_by_user_id fields in the related row of moped_project
    UPDATE moped_project
    SET updated_at = NOW(),
        updated_by_user_id = NEW.updated_by_user_id
    WHERE project_id = NEW.project_id;

    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.update_self_and_project_updated_audit_fields() IS 'Function to update the updated_at field in the current row of moped_proj_funding and the updated_at and updated_by_user_id fields in the related row of moped_project.';

CREATE TRIGGER update_self_and_project_audit_fields_audit_fields
BEFORE UPDATE ON moped_proj_funding
FOR EACH ROW
EXECUTE FUNCTION public.update_self_and_project_updated_audit_fields();

COMMENT ON TRIGGER update_self_and_project_audit_fields_audit_fields ON moped_proj_funding IS 'Trigger to execute the update_self_and_project_updated_audit_fields function before each update operation on the moped_proj_funding table.';
