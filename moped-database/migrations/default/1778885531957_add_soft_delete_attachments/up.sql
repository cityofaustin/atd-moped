ALTER TABLE files_ecapris_funding ADD COLUMN is_deleted boolean DEFAULT false NOT NULL;
ALTER TABLE files_project_funding ADD COLUMN is_deleted boolean DEFAULT false NOT NULL;

CREATE TRIGGER set_files_updated_at BEFORE UPDATE ON public.files_ecapris_funding FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_files_updated_at BEFORE UPDATE ON public.files_project_funding FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON COLUMN files_ecapris_funding.is_deleted IS 'Indicates soft deletion';
COMMENT ON COLUMN files_project_funding.is_deleted IS 'Indicates soft deletion';
