DROP TRIGGER IF EXISTS set_moped_project_updated_at ON public.moped_project;

CREATE TRIGGER set_moped_project_updated_at 
BEFORE UPDATE ON moped_project
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TRIGGER set_moped_project_updated_at ON public.moped_project IS 'Trigger to set updated_at timestamp for each insert or update on moped_project';
