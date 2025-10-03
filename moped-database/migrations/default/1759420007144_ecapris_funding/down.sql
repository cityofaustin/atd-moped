-- Remove funding sync flag from projects table
ALTER TABLE moped_project
DROP COLUMN should_sync_ecapris_funding;

-- Drop table for eCAPRIS funding data
DROP TABLE ecapris_funding;

-- Drop view to combine both funding sources
DROP VIEW IF EXISTS combined_project_funding_view;
