alter table "public"."moped_proj_phases" alter column "updated_at" set default clock_timestamp();

DROP TRIGGER update_moped_proj_phases_and_project_audit_fields ON moped_proj_phases; 

CREATE TRIGGER update_moped_proj_phases_and_project_audit_fields
    BEFORE UPDATE ON moped_proj_phases
    FOR EACH ROW
    EXECUTE FUNCTION public.update_self_and_project_updated_audit_fields ();

COMMENT ON TRIGGER update_moped_proj_phases_and_project_audit_fields ON moped_proj_phases IS 'Trigger to execute the update_self_and_project_updated_audit_fields function before each update operation on the moped_proj_phases table.';
