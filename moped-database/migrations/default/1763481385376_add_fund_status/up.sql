-- Update ecapris_subproject_funding table with status column
ALTER TABLE public.ecapris_subproject_funding
ADD COLUMN fdu_status TEXT DEFAULT NULL;

COMMENT ON COLUMN public.ecapris_subproject_funding.fdu_status IS 'The status of the FDU (Fund-Dept-Unit) code (Active or Inactive)';
COMMENT ON COLUMN public.ecapris_subproject_funding.program IS 'Program name associated with the funding record by atd-finance-data script';
COMMENT ON COLUMN public.ecapris_subproject_funding.subprogram IS 'Subprogram name associated with the funding record by atd-finance-data script';
COMMENT ON COLUMN public.ecapris_subproject_funding.created_at IS 'Timestamp when the record was created';
COMMENT ON COLUMN public.ecapris_subproject_funding.updated_at IS 'Timestamp when the record was last updated';
COMMENT ON COLUMN public.ecapris_subproject_funding.created_by_user_id IS 'ID of the user who created the record';
COMMENT ON COLUMN public.ecapris_subproject_funding.updated_by_user_id IS 'ID of the user who updated the record';
