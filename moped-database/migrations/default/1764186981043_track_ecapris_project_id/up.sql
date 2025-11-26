-- Update moped_proj_funding table with information about what eCAPRIS subproject id was used for import
ALTER TABLE moped_proj_funding
ADD COLUMN ecapris_subproject_id text,
ADD COLUMN is_manual boolean GENERATED ALWAYS AS (ecapris_subproject_id IS NULL) STORED;

COMMENT ON COLUMN public.moped_proj_funding.ecapris_subproject_id IS 'eCapris subproject ID number associated with imported or synced eCAPRIS FDU';
COMMENT ON COLUMN public.moped_proj_funding.is_manual IS 'Determines if FDU was imported or synced by eCAPRIS subproject ID association';
