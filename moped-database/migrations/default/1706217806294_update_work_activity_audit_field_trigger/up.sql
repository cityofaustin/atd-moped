-- on moped_proj_work_activity, use the `update_self_and_project_updated_audit_fields` function 
-- instead of the `set_updated_at()` function
DROP TRIGGER set_updated_at_before_insert_or_update ON moped_proj_work_activity;

CREATE TRIGGER update_moped_proj_work_activity_and_project_audit_fields
    BEFORE INSERT
    OR UPDATE ON moped_proj_work_activity
    FOR EACH ROW
    EXECUTE FUNCTION public.update_self_and_project_updated_audit_fields ();

-- on moped_proj_components, use the `update_self_and_project_updated_audit_fields` function 
-- instead of the `set_updated_at()` function
DROP TRIGGER set_updated_at_before_insert_or_update ON moped_proj_components;

CREATE TRIGGER update_moped_proj_components_and_project_audit_fields
    BEFORE INSERT
    OR UPDATE ON moped_proj_components
    FOR EACH ROW
    EXECUTE FUNCTION public.update_self_and_project_updated_audit_fields ();
