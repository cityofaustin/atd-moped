-- Drop the trigger
DROP TRIGGER update_self_and_project_audit_fields_audit_fields ON moped_proj_funding;

-- Drop the function
DROP FUNCTION public.update_self_and_project_updated_audit_fields();

-- Drop the new columns
ALTER TABLE moped_proj_funding DROP COLUMN updated_by_user_id;
ALTER TABLE moped_proj_funding DROP COLUMN updated_at;

-- Rename the old columns back to their original names
ALTER TABLE moped_proj_funding RENAME COLUMN created_by_user_id TO added_by;
ALTER TABLE moped_proj_funding RENAME COLUMN created_at TO date_added;