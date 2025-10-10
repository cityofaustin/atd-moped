-- Add funding sync tracking to projects table
ALTER TABLE moped_project
ADD COLUMN should_sync_ecapris_funding BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN moped_project.should_sync_ecapris_funding IS 'Indicates if project funding should be synced from eCAPRIS';
-- Fix eCAPRIS name in existing comment
COMMENT ON COLUMN moped_project.should_sync_ecapris_statuses IS 'Indicates if project statuses should be synced from eCAPRIS';

-- Update moped_proj_funding table
ALTER TABLE moped_proj_funding
ADD COLUMN ecapris_funding_id INTEGER,
ADD COLUMN is_legacy_funding_record BOOLEAN DEFAULT FALSE,
ADD COLUMN is_editable BOOLEAN GENERATED ALWAYS AS (ecapris_funding_id IS NOT NULL) STORED;

COMMENT ON COLUMN moped_proj_funding.ecapris_funding_id IS 'References the eCAPRIS FDU unique fao_id if applicable';
COMMENT ON COLUMN moped_proj_funding.is_legacy_funding_record IS 'Indicates if the funding record was created before eCAPRIS sync integration (Nov 2025)';

-- Mark all existing funding records as legacy before eCAPRIS sync integration
UPDATE moped_proj_funding
SET is_legacy_funding_record = TRUE;
