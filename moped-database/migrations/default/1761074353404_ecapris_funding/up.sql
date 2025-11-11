-- Add funding sync tracking to projects table
ALTER TABLE moped_project
ADD COLUMN should_sync_ecapris_funding BOOLEAN DEFAULT FALSE NOT NULL;

COMMENT ON COLUMN moped_project.should_sync_ecapris_funding IS 'Indicates if project funding should be synced from eCAPRIS';
-- Fix eCAPRIS name in existing comment
COMMENT ON COLUMN moped_project.should_sync_ecapris_statuses IS 'Indicates if project statuses should be synced from eCAPRIS';

-- Update moped_proj_funding table to include information available new eCAPRIS data source and to track legacy records
ALTER TABLE moped_proj_funding
ADD COLUMN ecapris_funding_id INTEGER,
ADD COLUMN is_legacy_funding_record BOOLEAN DEFAULT FALSE NOT NULL,
ADD COLUMN fdu TEXT DEFAULT NULL,
ADD COLUMN unit_long_name TEXT DEFAULT NULL;

-- Index fdu since we'll be querying by it to avoid duplicates in the combined view (using NOT EXISTS)
CREATE INDEX idx_moped_proj_funding_fdu_not_deleted
ON moped_proj_funding (fdu)
WHERE is_deleted = FALSE AND fdu IS NOT NULL;

-- Index project_id since we are going to be joining this in the project_list_View
CREATE INDEX idx_moped_proj_funding_project_id
ON moped_proj_funding (project_id)
WHERE is_deleted = FALSE;

-- Index foreign keys of source, program, and status since we join in the combined view
CREATE INDEX idx_moped_proj_funding_status_id
ON moped_proj_funding (funding_status_id);

CREATE INDEX idx_moped_proj_funding_source_id
ON moped_proj_funding (funding_source_id);

CREATE INDEX idx_moped_proj_funding_program_id
ON moped_proj_funding (funding_program_id);

COMMENT ON COLUMN moped_proj_funding.ecapris_funding_id IS 'References the eCAPRIS FDU unique fao_id of imported eCAPRIS funding records';
COMMENT ON COLUMN moped_proj_funding.is_legacy_funding_record IS 'Indicates if the funding record was created before eCAPRIS sync integration (Nov 2025)';

-- Add comments on other existing moped_proj_funding columns
COMMENT ON COLUMN moped_proj_funding.proj_funding_id IS 'Primary key for the project funding record';
COMMENT ON COLUMN moped_proj_funding.created_by_user_id IS 'ID of the user who last created the record';
COMMENT ON COLUMN moped_proj_funding.created_at IS 'Timestamp when the record was last created';
COMMENT ON COLUMN moped_proj_funding.project_id IS 'References the project this funding record is associated with';
COMMENT ON COLUMN moped_proj_funding.funding_source_id IS 'References the funding source for this funding record';
COMMENT ON COLUMN moped_proj_funding.funding_program_id IS 'References the funding program for this funding record';
COMMENT ON COLUMN moped_proj_funding.funding_amount IS 'The amount of funding allocated from this funding source';
COMMENT ON COLUMN moped_proj_funding.funding_description IS 'A description of the funding source';
COMMENT ON COLUMN moped_proj_funding.funding_status_id IS 'References the current status of this funding record';
COMMENT ON COLUMN moped_proj_funding.fund IS 'Legacy JSONB object containing additional fund details from eCAPRIS (Socrata jega-nqf6)';
COMMENT ON COLUMN moped_proj_funding.dept_unit IS 'Legacy JSONB object containing additional department/unit details from eCAPRIS (Socrata bgrt-2m2z)';
COMMENT ON COLUMN moped_proj_funding.fdu IS 'The FDU (Fund-Dept-Unit) code associated with this funding record from eCAPRIS';
COMMENT ON COLUMN moped_proj_funding.unit_long_name IS 'The long name of the unit associated with this funding record from eCAPRIS';

-- Create ecapris_subproject_funding table with column comments
CREATE TABLE public.ecapris_subproject_funding (
    id SERIAL PRIMARY KEY,
    ecapris_subproject_id TEXT NOT NULL,
    fao_id INTEGER NOT NULL UNIQUE,
    fdu TEXT NOT NULL,
    app INT4 NOT NULL,
    unit_long_name TEXT NOT NULL,
    subprogram TEXT DEFAULT NULL,
    program TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_by_user_id INTEGER REFERENCES moped_users (user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    updated_by_user_id INTEGER REFERENCES moped_users (user_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Index fdu since we'll be querying by it to avoid duplicates in the combined view (using NOT EXISTS)
CREATE INDEX idx_ecapris_subproject_funding_fdu
ON ecapris_subproject_funding (fdu);

-- Index ecapris_subproject_id for our future GraphQL query for the project funding table
CREATE INDEX idx_ecapris_subproject_funding_subproject_id
ON ecapris_subproject_funding (ecapris_subproject_id);

COMMENT ON TABLE public.ecapris_subproject_funding IS 'Stores eCAPRIS subproject fund records synced from the FSD Data Warehouse to supplement the moped_proj_funding table records.';
COMMENT ON COLUMN public.ecapris_subproject_funding.id IS 'Primary key for the table';
COMMENT ON COLUMN public.ecapris_subproject_funding.ecapris_subproject_id IS 'eCapris subproject ID number';
COMMENT ON COLUMN public.ecapris_subproject_funding.fao_id IS 'Unique ID for the FDU (Fund-Dept-Unit) from eCAPRIS';
COMMENT ON COLUMN public.ecapris_subproject_funding.fdu IS 'The FDU (Fund-Dept-Unit) code associated with this funding record from eCAPRIS';
COMMENT ON COLUMN public.ecapris_subproject_funding.app IS 'The appropriated amount associated with this funding record from eCAPRIS';
COMMENT ON COLUMN public.ecapris_subproject_funding.unit_long_name IS 'The long name of the unit associated with this funding record from eCAPRIS';
COMMENT ON COLUMN public.ecapris_subproject_statuses.created_at IS 'Timestamp when the record was created';
COMMENT ON COLUMN public.ecapris_subproject_statuses.updated_at IS 'Timestamp when the record was last updated';
COMMENT ON COLUMN public.ecapris_subproject_statuses.created_by_user_id IS 'ID of the user who created the record';
COMMENT ON COLUMN public.ecapris_subproject_statuses.updated_by_user_id IS 'ID of the user who updated the record';

-- Create a combined_project_funding_view for the project funding UI to consume. This view combines
-- both moped_proj_funding and ecapris_subproject_funding data and removes duplicates based on FDU.
CREATE OR REPLACE VIEW combined_project_funding_view AS
SELECT
    ('moped_' || moped_proj_funding.proj_funding_id) AS id,
    moped_proj_funding.proj_funding_id AS original_id,
    moped_proj_funding.created_at,
    moped_proj_funding.updated_at,
    moped_proj_funding.project_id,
    moped_proj_funding.fdu AS fdu,
    moped_proj_funding.funding_amount AS amount,
    moped_proj_funding.funding_description AS description,
    moped_fund_sources.funding_source_name AS source_name,
    moped_fund_status.funding_status_name AS status_name,
    moped_fund_programs.funding_program_name AS program_name,
    NULL AS fao_id,
    NULL AS ecapris_subproject_id
FROM
    moped_proj_funding
LEFT JOIN moped_fund_status ON moped_proj_funding.funding_status_id = moped_fund_status.funding_status_id
LEFT JOIN moped_fund_sources ON moped_proj_funding.funding_source_id = moped_fund_sources.funding_source_id
LEFT JOIN moped_fund_programs ON moped_proj_funding.funding_program_id = moped_fund_programs.funding_program_id
WHERE moped_proj_funding.is_deleted = FALSE
UNION ALL
SELECT
    ('ecapris_' || ecapris_subproject_funding.id) AS id,
    ecapris_subproject_funding.id AS original_id,
    ecapris_subproject_funding.created_at,
    ecapris_subproject_funding.updated_at,
    NULL AS project_id,
    ecapris_subproject_funding.fdu AS fdu,
    ecapris_subproject_funding.app AS amount,
    'Synced from eCAPRIS' AS description,
    NULL AS source_name,
    'Set up' AS status_name,
    NULL AS program_name,
    ecapris_subproject_funding.fao_id,
    ecapris_subproject_funding.ecapris_subproject_id
FROM
    ecapris_subproject_funding
WHERE NOT EXISTS (
        SELECT 1
        FROM moped_proj_funding
        WHERE moped_proj_funding.fdu = ecapris_subproject_funding.fdu
            AND moped_proj_funding.is_deleted = FALSE
    );

-- Disable Hasura triggers temporarily to allow direct updates to moped_proj_funding without generating activity log entries
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM pg_trigger 
    WHERE tgname = 'notify_hasura_activity_log_moped_proj_funding_UPDATE'
      AND tgrelid = 'moped_proj_funding'::regclass
  ) THEN
    ALTER TABLE moped_proj_funding 
    DISABLE TRIGGER "notify_hasura_activity_log_moped_proj_funding_UPDATE";
  ELSE
    RAISE NOTICE 'Trigger does not exist, skipping';
  END IF;

    IF EXISTS (
        SELECT 1 
        FROM pg_trigger 
        WHERE tgname = 'update_moped_proj_funding_and_project_audit_fields'
        AND tgrelid = 'moped_proj_funding'::regclass
    ) THEN
        ALTER TABLE moped_proj_funding 
        DISABLE TRIGGER "update_moped_proj_funding_and_project_audit_fields";
    ELSE
        RAISE NOTICE 'Trigger does not exist, skipping';
    END IF;

    IF EXISTS (
        SELECT 1 
        FROM pg_trigger 
        WHERE tgname = 'set_moped_project_updated_at'
        AND tgrelid = 'moped_project'::regclass
    ) THEN
        ALTER TABLE moped_project 
        DISABLE TRIGGER "set_moped_project_updated_at";
    ELSE
        RAISE NOTICE 'Trigger does not exist, skipping';
    END IF;
END $$;

-- Switch on sync for projects with ecapris_subproject_id set
UPDATE moped_project SET should_sync_ecapris_funding = TRUE
WHERE ecapris_subproject_id IS NOT NULL;

-- Populate new fdu column based on existing fund_dept_unit data if available and 
-- populate unit_long_name from dept_unit JSONB
-- Note: fund_dept_unit is a generated column that is null if fund or dept_unit is null
UPDATE moped_proj_funding
SET
    fdu = fund_dept_unit,
    unit_long_name = (dept_unit ->> 'unit_long_name')
WHERE fund_dept_unit IS NOT NULL;

-- Mark all existing funding records as legacy before eCAPRIS sync integration launches
UPDATE moped_proj_funding
SET is_legacy_funding_record = TRUE;

-- Re-enable Hasura triggers
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM pg_trigger 
    WHERE tgname = 'notify_hasura_activity_log_moped_proj_funding_UPDATE'
      AND tgrelid = 'moped_proj_funding'::regclass
  ) THEN
    ALTER TABLE moped_proj_funding 
    ENABLE TRIGGER "notify_hasura_activity_log_moped_proj_funding_UPDATE";
  ELSE
    RAISE NOTICE 'Trigger does not exist, skipping';
  END IF;

    IF EXISTS (
        SELECT 1 
        FROM pg_trigger 
        WHERE tgname = 'update_moped_proj_funding_and_project_audit_fields'
        AND tgrelid = 'moped_proj_funding'::regclass
    ) THEN
        ALTER TABLE moped_proj_funding 
        ENABLE TRIGGER "update_moped_proj_funding_and_project_audit_fields";
    ELSE
        RAISE NOTICE 'Trigger does not exist, skipping';
    END IF;

    IF EXISTS (
        SELECT 1 
        FROM pg_trigger 
        WHERE tgname = 'set_moped_project_updated_at'
        AND tgrelid = 'moped_project'::regclass
    ) THEN
        ALTER TABLE moped_project 
        ENABLE TRIGGER "set_moped_project_updated_at";
    ELSE
        RAISE NOTICE 'Trigger does not exist, skipping';
    END IF;
END $$;

-- Drop and recreate view to use new fdu column instead of fund_dept_unit
DROP VIEW IF EXISTS project_funding_view;

CREATE OR REPLACE VIEW project_funding_view AS SELECT
    moped_project.project_id,
    combined_project_funding_view.id AS proj_funding_id,
    combined_project_funding_view.amount AS funding_amount,
    combined_project_funding_view.description AS funding_description,
    combined_project_funding_view.fdu AS fund_dept_unit,
    combined_project_funding_view.created_at,
    combined_project_funding_view.updated_at,
    combined_project_funding_view.source_name AS funding_source_name,
    combined_project_funding_view.program_name AS funding_program_name,
    combined_project_funding_view.status_name AS funding_status_name
FROM moped_project
LEFT JOIN combined_project_funding_view ON moped_project.project_id = combined_project_funding_view.project_id OR (moped_project.ecapris_subproject_id = combined_project_funding_view.ecapris_subproject_id AND moped_project.ecapris_subproject_id IS NOT NULL)
WHERE TRUE AND moped_project.is_deleted = FALSE;
