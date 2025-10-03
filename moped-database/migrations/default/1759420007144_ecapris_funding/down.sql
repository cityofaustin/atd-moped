-- Remove funding sync flag from projects table
ALTER TABLE moped_project
DROP COLUMN should_sync_ecapris_funding;

-- Drop trigger to set updated_at audit column
DROP TRIGGER IF EXISTS set_ecapris_funding_updated_at ON public.ecapris_funding;

-- Drop combined funding view
DROP VIEW IF EXISTS combined_project_funding_view;

-- Drop table for eCAPRIS funding data
DROP TABLE IF EXISTS ecapris_funding;

-- Drop view to combine both funding sources
DROP VIEW IF EXISTS combined_project_funding_view;
