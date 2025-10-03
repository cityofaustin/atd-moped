-- Add funding sync tracking to projects table
ALTER TABLE moped_project
ADD COLUMN should_sync_ecapris_funding BOOLEAN DEFAULT FALSE;

-- Add comment for the new column
COMMENT ON COLUMN moped_project.should_sync_ecapris_funding IS 'Indicates if project funding should be synced with eCAPRIS';
-- Fix eCAPRIS name in existing comment
COMMENT ON COLUMN moped_project.should_sync_ecapris_statuses IS 'Indicates if project statuses should be synced with eCAPRIS';

-- New table for eCAPRIS funding data
CREATE TABLE public.ecapris_funding (
    -- Primary key and foreign keys
    id SERIAL PRIMARY KEY,

    -- eCAPRIS unique identifier
    fao_id INTEGER NOT NULL UNIQUE, -- Unique FDU id field from eCAPRIS

    -- FDU and Fund information
    ecapris_subproject_id TEXT NOT NULL,
    fdu TEXT,
    fdu_status TEXT,
    fund TEXT,
    fund_long_name TEXT,

    -- Department information
    dept INTEGER,
    dept_long_name TEXT,

    -- Division hierarchy
    lvl1_div_code TEXT,
    lvl1_div_long_name TEXT,
    lvl2_gp_code TEXT,
    lvl2_gp_long_name TEXT,

    -- Unit information
    unit TEXT,
    unit_long_name TEXT,

    -- Financial identifiers
    sp_name TEXT,
    sp_status TEXT,

    -- Program information
    program TEXT,
    subprogram TEXT,
    bond_year INTEGER,
    ecapris_link TEXT,

    -- Financial amounts
    appropriated NUMERIC(12, 2),
    expenses NUMERIC(12, 2),
    obligated NUMERIC(12, 2),
    encumbered NUMERIC(12, 2),
    fdu_bal NUMERIC(12, 2),

    -- Sync metadata
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    created_by_user_id INTEGER REFERENCES moped_users (user_id) DEFAULT NULL,
    updated_by_user_id INTEGER REFERENCES moped_users (user_id) DEFAULT NULL
);

CREATE INDEX idx_ecapris_funding_ecapris_id
ON ecapris_funding (fao_id);
CREATE INDEX idx_ecapris_funding_fdu
ON ecapris_funding (fdu);
CREATE INDEX idx_ecapris_funding_sp_number
ON ecapris_funding (ecapris_subproject_id);

COMMENT ON TABLE ecapris_funding IS 'Stores eCAPRIS subproject status records synced from the FSD Data Warehouse to supplement the moped_proj_funding table records.';
COMMENT ON COLUMN ecapris_funding.id IS 'Primary key for the table';
COMMENT ON COLUMN ecapris_funding.fao_id IS 'Unique ID of FDU from eCapris';
COMMENT ON COLUMN ecapris_funding.ecapris_subproject_id IS 'eCapris subproject ID number';
COMMENT ON COLUMN ecapris_funding.fdu IS 'Fund-Department-Unit concatenated';
COMMENT ON COLUMN ecapris_funding.fdu_status IS 'FDU status (Active or Inactive)';
COMMENT ON COLUMN ecapris_funding.fund IS 'Fund code';
COMMENT ON COLUMN ecapris_funding.fund_long_name IS 'Long name description of Fund';
COMMENT ON COLUMN ecapris_funding.dept IS 'Department code';
COMMENT ON COLUMN ecapris_funding.dept_long_name IS 'Long name description of Department';
COMMENT ON COLUMN ecapris_funding.lvl1_div_code IS 'Level 1 Division code';
COMMENT ON COLUMN ecapris_funding.lvl1_div_long_name IS 'Long name description of Level 1 Division';
COMMENT ON COLUMN ecapris_funding.lvl2_gp_code IS 'Level 2 Group code';
COMMENT ON COLUMN ecapris_funding.lvl2_gp_long_name IS 'Long name description of Level 2 Group';
COMMENT ON COLUMN ecapris_funding.unit IS 'Unit code';
COMMENT ON COLUMN ecapris_funding.unit_long_name IS 'Long name description of Unit';
COMMENT ON COLUMN ecapris_funding.sp_name IS 'Subproject name/description';
COMMENT ON COLUMN ecapris_funding.sp_status IS 'Subproject status (Open or Closed)';
COMMENT ON COLUMN ecapris_funding.program IS 'Program name provided by atd-finance-data script';
COMMENT ON COLUMN ecapris_funding.subprogram IS 'Subprogram name provided by atd-finance-data script';
COMMENT ON COLUMN ecapris_funding.bond_year IS 'Bond year';
COMMENT ON COLUMN ecapris_funding.ecapris_link IS 'Link to the eCapris subproject page';
COMMENT ON COLUMN ecapris_funding.appropriated IS 'Appropriated amount (app field from Socrata dataset)';
COMMENT ON COLUMN ecapris_funding.expenses IS 'Expenses (exp field from Socrata dataset)';
COMMENT ON COLUMN ecapris_funding.obligated IS 'Obligated amount (obl field from Socrata dataset)';
COMMENT ON COLUMN ecapris_funding.encumbered IS 'Encumbered amount (enc field from Socrata dataset)';
COMMENT ON COLUMN ecapris_funding.fdu_bal IS 'FDU Balance';
COMMENT ON COLUMN ecapris_funding.created_at IS 'Timestamp when the record was created';
COMMENT ON COLUMN ecapris_funding.updated_at IS 'Timestamp when the record was last updated';
COMMENT ON COLUMN ecapris_funding.created_by_user_id IS 'ID of the user who created the record';
COMMENT ON COLUMN ecapris_funding.updated_by_user_id IS 'ID of the user who updated the record';


-- Create view to combine both sources of funding records
CREATE VIEW combined_project_funding_view AS
SELECT
    'moped_'::TEXT || proj_funding_id AS id,
    proj_funding_id AS original_id,
    NULL AS ecapris_subproject_id,
    project_id,
    funding_amount,
    funding_description,
    funding_status_id,
    fund,
    dept_unit,
    fund_dept_unit,
    created_at,
    updated_at,
    TRUE AS is_editable
FROM moped_proj_funding
WHERE is_deleted = FALSE

UNION ALL

SELECT
    'ecapris_'::TEXT || ecapris_funding_id AS id,
    fao_id AS original_id,
    ecapris_subproject_id,
    NULL AS project_id,
    round(appropriated)::INTEGER AS funding_amount,
    NULL AS funding_description,
    2 AS funding_status_id,
    NULL AS fund,
    NULL AS dept_unit,
    fdu AS fund_dept_unit,
    created_at,
    updated_at,
    FALSE AS is_editable
FROM ecapris_funding;
