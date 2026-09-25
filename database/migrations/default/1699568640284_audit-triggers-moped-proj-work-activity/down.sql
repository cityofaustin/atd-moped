DROP TRIGGER IF EXISTS set_updated_at_before_insert_or_update ON moped_proj_work_activity;

CREATE TRIGGER set_proj_work_activity_trigger_updated_at
BEFORE UPDATE ON moped_proj_work_activity
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
