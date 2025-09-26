-- Add override tracking to existing table
ALTER TABLE moped_project
ADD COLUMN should_sync_ecapris_funding BOOLEAN DEFAULT FALSE;

-- New table for eCAPRIS funding data
CREATE TABLE ecapris_funding (
    -- Primary key and foreign keys
    ecapris_funding_id SERIAL PRIMARY KEY,
    
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
    ecapris_link TEXT, -- Storing URL as TEXT
    
    -- Financial amounts
    appropriated NUMERIC(12, 2), -- Using NUMERIC for money amounts
    expenses NUMERIC(12, 2),
    obligated NUMERIC(12, 2),
    encumbered NUMERIC(12, 2),
    fdu_bal NUMERIC(12, 2),
    
    -- Sync metadata
    updated_at timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
);

-- Indices for performance
CREATE INDEX idx_ecapris_funding_ecapris_id 
    ON ecapris_funding(fao_id);
CREATE INDEX idx_ecapris_funding_fdu 
    ON ecapris_funding(fdu);
CREATE INDEX idx_ecapris_funding_sp_number 
    ON ecapris_funding(ecapris_subproject_id);

-- Comments for documentation
COMMENT ON TABLE ecapris_funding IS 'Stores eCAPRIS subproject status records synced from the FSD Data Warehouse to supplement the moped_proj_funding table records.';
COMMENT ON COLUMN ecapris_funding.ecapris_id IS 'eCapris subproject ID number (SP number)';
COMMENT ON COLUMN ecapris_funding.fdu IS 'Fund-Department-Unit concatenated';
COMMENT ON COLUMN ecapris_funding.fdu_status IS 'FDU status (Active or Inactive)';
COMMENT ON COLUMN ecapris_funding.appropriated IS 'Appropriated amount (app field from API)';
COMMENT ON COLUMN ecapris_funding.expenses IS 'Expenses (exp field from API)';
COMMENT ON COLUMN ecapris_funding.obligated IS 'Obligated amount (obl field from API)';
COMMENT ON COLUMN ecapris_funding.encumbered IS 'Encumbered amount (enc field from API)';
COMMENT ON COLUMN ecapris_funding.fdu_bal IS 'FDU Balance';
COMMENT ON COLUMN ecapris_funding.fao_id IS 'Unique ID of FDU from eCapris';

-- Add override tracking to existing table
ALTER TABLE moped_proj_funding
ADD COLUMN overrides_ecapris_id VARCHAR(255);

-- View to combine both sources
CREATE VIEW combined_project_funding_view AS
SELECT
    'moped_'::text || proj_funding_id AS id,
    proj_funding_id  AS original_id,
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
    overrides_ecapris_funding_id
FROM moped_proj_funding
WHERE is_deleted = FALSE

UNION ALL

SELECT
    'ecapris_'::text || ecapris_funding_id AS id,
    fao_id AS original_id,
    ecapris_subproject_id,
    NULL AS project_id,
    app AS funding_amount,
    null AS funding_description,
    2 AS funding_status_id,
    NULL AS fund,
    NULL AS dept_unit,
    fdu AS fund_dept_unit,
    created_at,
    updated_at,
    NULL as overrides_ecapris_id
FROM ecapris_funding;
