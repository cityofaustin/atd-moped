DROP TRIGGER update_moped_proj_work_activity_and_project_audit_fields ON moped_proj_work_activity;

CREATE TRIGGER set_updated_at_before_insert_or_update
BEFORE INSERT OR UPDATE ON moped_proj_work_activity
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER update_moped_proj_components_and_project_audit_fields on moped_proj_components;

CREATE TRIGGER set_updated_at_before_insert_or_update
BEFORE INSERT OR UPDATE ON moped_proj_components
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
