drop trigger if exists set_proj_work_activity_trigger_updated_at on public.moped_proj_work_activity;

CREATE TRIGGER set_updated_at_before_insert_or_update
BEFORE INSERT OR UPDATE ON moped_proj_work_activity
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
