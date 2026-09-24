--
-- ADD NEW PROGRAMS AND SOURCES FROM PROGRAM TAGGING
--
INSERT INTO moped_fund_programs (funding_program_name)
SELECT 'Bridges & Structures' WHERE NOT EXISTS (
        SELECT 1 FROM moped_fund_programs
        WHERE funding_program_name = 'Bridges & Structures'
    );

INSERT INTO moped_fund_programs (funding_program_name)
SELECT 'Local Transit - Micro Mobility' WHERE NOT EXISTS (
        SELECT 1 FROM moped_fund_programs
        WHERE funding_program_name = 'Local Transit - Micro Mobility'
    );

INSERT INTO moped_fund_programs (funding_program_name)
SELECT 'Local Transit - Signal Cabinet Security' WHERE NOT EXISTS (
        SELECT 1 FROM moped_fund_programs
        WHERE funding_program_name = 'Local Transit - Signal Cabinet Security'
    );

INSERT INTO moped_fund_programs (funding_program_name)
SELECT 'Local Transit - Signal Priority' WHERE NOT EXISTS (
        SELECT 1 FROM moped_fund_programs
        WHERE funding_program_name = 'Local Transit - Signal Priority'
    );

INSERT INTO moped_fund_programs (funding_program_name)
SELECT 'Local Transit - Smart Mobility' WHERE NOT EXISTS (
        SELECT 1 FROM moped_fund_programs
        WHERE funding_program_name = 'Local Transit - Smart Mobility'
    );

INSERT INTO moped_fund_programs (funding_program_name)
SELECT 'Street Programs' WHERE NOT EXISTS (
        SELECT 1 FROM moped_fund_programs
        WHERE funding_program_name = 'Street Programs'
    );

INSERT INTO moped_fund_programs (funding_program_name)
SELECT 'Vision Zero - Signal Safety' WHERE NOT EXISTS (
        SELECT 1 FROM moped_fund_programs
        WHERE funding_program_name = 'Vision Zero - Signal Safety'
    );

INSERT INTO moped_fund_programs (funding_program_name)
SELECT 'Developer Transportation Improvements Program' WHERE NOT EXISTS (
        SELECT 1 FROM moped_fund_programs
        WHERE funding_program_name = 'Developer Transportation Improvements Program'
    );

-- Add new sources
INSERT INTO moped_fund_sources (funding_source_name)
SELECT 'Highway Safety Improvements' WHERE NOT EXISTS (
        SELECT 1 FROM moped_fund_sources
        WHERE funding_source_name = 'Highway Safety Improvements'
    );

INSERT INTO moped_fund_sources (funding_source_name)
SELECT 'ATPW Operating Fund' WHERE NOT EXISTS (
        SELECT 1 FROM moped_fund_sources
        WHERE funding_source_name = 'ATPW Operating Fund'
    );

INSERT INTO moped_fund_sources (funding_source_name)
SELECT 'Transit ILA 2018' WHERE NOT EXISTS (
        SELECT 1 FROM moped_fund_sources
        WHERE funding_source_name = 'Transit ILA 2018'
    );

INSERT INTO moped_fund_sources (funding_source_name)
SELECT 'Private Development - Fiscal Surety' WHERE NOT EXISTS (
        SELECT 1 FROM moped_fund_sources
        WHERE funding_source_name = 'Private Development - Fiscal Surety'
    );

INSERT INTO moped_fund_sources (funding_source_name)
SELECT 'Private Development - Fee In Lieu' WHERE NOT EXISTS (
        SELECT 1 FROM moped_fund_sources
        WHERE funding_source_name = 'Private Development - Fee In Lieu'
    );

INSERT INTO moped_fund_sources (funding_source_name)
SELECT 'Private Development - Street Impact Fee' WHERE NOT EXISTS (
        SELECT 1 FROM moped_fund_sources
        WHERE funding_source_name = 'Private Development - Street Impact Fee'
    );

-- Rename programs
UPDATE moped_fund_programs
SET funding_program_name = 'Corridor Program'
WHERE funding_program_name = 'Corridor';

UPDATE moped_fund_programs
SET funding_program_name = 'Local Transit - Local Transit Enhancement'
WHERE funding_program_name = 'Transit Enhancement Program';

UPDATE moped_fund_programs
SET funding_program_name = 'Regional'
WHERE funding_program_name = 'Regional Mobility';

UPDATE moped_fund_programs
SET funding_program_name = 'Safe Routes'
WHERE funding_program_name = 'Safe Routes to Schools';

UPDATE moped_fund_programs
SET funding_program_name = 'Traffic Signals'
WHERE funding_program_name = 'Signals';

UPDATE moped_fund_programs
SET funding_program_name = 'Vision Zero - Major Safety'
WHERE funding_program_name = 'Intersection Safety';

UPDATE moped_fund_programs
SET funding_program_name = 'Vision Zero - Speed Management'
WHERE funding_program_name = 'Speed Management';

--
-- UPDATE PROJECT FUNDING RECORDS TO NEW PROGRAMS AND SOURCES
--
-- Update 2018 Interlocal Agreement project funding records to new program and source
-- 1. Update project funding records with 2018 Interlocal Agreement program with new Transit ILA 2018 source
WITH
updated_source AS (
    SELECT funding_source_id
    FROM
        moped_fund_sources
    WHERE
        funding_source_name = 'Transit ILA 2018'
)

UPDATE moped_proj_funding
SET
    funding_source_id = updated_source.funding_source_id
FROM
    updated_source,
    moped_fund_programs
WHERE
    moped_proj_funding.funding_program_id = moped_fund_programs.funding_program_id
    AND (moped_fund_programs.funding_program_name = '2018 Interlocal Agreement');

-- 2. Update project funding records with 2018 Interlocal Agreement program to new Local Transit - Local Transit Enhancement program
WITH
updated_program AS (
    SELECT funding_program_id
    FROM
        moped_fund_programs
    WHERE
        funding_program_name = 'Local Transit - Local Transit Enhancement'
)

UPDATE moped_proj_funding
SET
    funding_program_id = updated_program.funding_program_id
FROM
    updated_program,
    moped_fund_programs
WHERE
    moped_proj_funding.funding_program_id = moped_fund_programs.funding_program_id
    AND moped_fund_programs.funding_program_name = '2018 Interlocal Agreement';

-- Update project funding records with Mitigation Fees and Traffic Mitigation Fees programs to new Private Development sources
-- 1. Update project funding records with Mitigation Fee program to new Private Development - Fiscal Surety source
WITH
updated_source AS (
    SELECT funding_source_id
    FROM
        moped_fund_sources
    WHERE
        funding_source_name = 'Private Development - Fiscal Surety'
)

UPDATE moped_proj_funding
SET
    funding_source_id = updated_source.funding_source_id
FROM
    updated_source,
    moped_fund_programs
WHERE
    moped_proj_funding.funding_program_id = moped_fund_programs.funding_program_id
    AND (moped_fund_programs.funding_program_name = 'Mitigation Fees');

-- 2. Update project funding records with Traffic Mitigation Fee program to new Private Development - Fee In Lieu source
WITH
updated_source AS (
    SELECT funding_source_id
    FROM
        moped_fund_sources
    WHERE
        funding_source_name = 'Private Development - Fee In Lieu'
)

UPDATE moped_proj_funding
SET
    funding_source_id = updated_source.funding_source_id
FROM
    updated_source,
    moped_fund_programs
WHERE
    moped_proj_funding.funding_program_id = moped_fund_programs.funding_program_id
    AND (moped_fund_programs.funding_program_name = 'Traffic Mitigation Fees');


-- 3. Update project funding records with Mitigation Fee and Traffic Mitigation Fees programs to new Developer Transportation Improvements Program
WITH
updated_program AS (
    SELECT funding_program_id
    FROM
        moped_fund_programs
    WHERE
        funding_program_name = 'Developer Transportation Improvements Program'
)

UPDATE moped_proj_funding
SET
    funding_program_id = updated_program.funding_program_id
FROM
    updated_program,
    moped_fund_programs
WHERE
    moped_proj_funding.funding_program_id = moped_fund_programs.funding_program_id
    AND (moped_fund_programs.funding_program_name = 'Mitigation Fees' OR moped_fund_programs.funding_program_name = 'Traffic Mitigation Fees');

-- Update project funding records with Operating Fund program to new ATPW Operating Fund source
WITH
updated_source AS (
    SELECT funding_source_id
    FROM
        moped_fund_sources
    WHERE
        funding_source_name = 'ATPW Operating Fund'
)

UPDATE moped_proj_funding
SET
    funding_source_id = updated_source.funding_source_id
FROM
    updated_source,
    moped_fund_programs
WHERE
    moped_proj_funding.funding_program_id = moped_fund_programs.funding_program_id
    AND (moped_fund_programs.funding_program_name = 'Operating Fund');

-- Update project funding records with Sidewalk Fee in Lieu program to new Private Development - Fee In Lieu source
WITH
updated_source AS (
    SELECT funding_source_id
    FROM
        moped_fund_sources
    WHERE
        funding_source_name = 'Private Development - Fee In Lieu'
)

UPDATE moped_proj_funding
SET
    funding_source_id = updated_source.funding_source_id
FROM
    updated_source,
    moped_fund_programs
WHERE
    moped_proj_funding.funding_program_id = moped_fund_programs.funding_program_id
    AND (moped_fund_programs.funding_program_name = 'Sidewalk Fee in Lieu');

--
-- SOFT DELETE OLD PROGRAMS
--
UPDATE moped_fund_programs
SET is_deleted = TRUE
WHERE funding_program_name = 'Operating Fund'
    OR funding_program_name = 'Large CIP'
    OR funding_program_name = '2018 Interlocal Agreement'
    OR funding_program_name = 'Highway Safety Improvements'
    OR funding_program_name = 'IH35'
    OR funding_program_name = 'Mitigation Fees'
    OR funding_program_name = 'Traffic Mitigation Fees'
    OR funding_program_name = 'Project Development'
    OR funding_program_name = 'Sidewalk Fee in Lieu'
    OR funding_program_name = 'Sidewalk Rehab'
    OR funding_program_name = 'Street & Bridge Operations'
    OR funding_program_name = 'Transportation Enhancements 2009 Grant';

--
-- ADD BOND YEAR, CREATE TRIGGER TO MATCH FUNDING PROGRAM AND SOURCE, AND UPDATE COMBINED FUNDING VIEW
--
-- Add bond year to ecapris_subproject_funding table so we can try to match funding sources
ALTER TABLE ecapris_subproject_funding
ADD COLUMN bond_year INT4,
ADD COLUMN funding_source_id INT4 REFERENCES moped_fund_sources (funding_source_id),
ADD COLUMN funding_program_id INT4 REFERENCES moped_fund_programs (funding_program_id);

COMMENT ON COLUMN public.ecapris_subproject_funding.bond_year IS 'The bond year associated with FDU funding record from eCAPRIS';
COMMENT ON COLUMN public.ecapris_subproject_funding.funding_source_id IS 'Foreign key to moped_fund_sources matched by bond year from eCAPRIS funding record';
COMMENT ON COLUMN public.ecapris_subproject_funding.funding_program_id IS 'Foreign key to moped_fund_programs matched by program/subprogram from eCAPRIS funding record';

-- Add trigger function and trigger to attempt assigning program foreign key on insert/update of eCAPRIS funding records
CREATE OR REPLACE FUNCTION match_ecapris_funding_to_source_and_programs_foreign_keys()
RETURNS TRIGGER AS $$
BEGIN
    -- Try matching funding program name to moped_fund_programs
    IF NEW.program IS NOT NULL THEN
        -- First try program + subprogram if subprogram exists
        IF NEW.subprogram IS NOT NULL THEN
            SELECT funding_program_id INTO NEW.funding_program_id
            FROM moped_fund_programs
            WHERE funding_program_name = NEW.program || ' - ' || NEW.subprogram
            LIMIT 1;
        END IF;
        
        -- If no match with subprogram (or no subprogram), try program-only
        IF NEW.funding_program_id IS NULL THEN
            SELECT funding_program_id INTO NEW.funding_program_id
            FROM moped_fund_programs
            WHERE funding_program_name = NEW.program
            LIMIT 1;
        END IF;
    END IF;

    -- Try matching funding bond year to moped_fund_sources formatted as "<year> Bond"
   IF NEW.bond_year IS NOT NULL THEN
        SELECT funding_source_id INTO NEW.funding_source_id
        FROM moped_fund_sources
        WHERE funding_source_name = NEW.bond_year::TEXT || ' Bond'
        LIMIT 1;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER match_ecapris_funding_keys_trigger
BEFORE INSERT OR UPDATE ON ecapris_subproject_funding
FOR EACH ROW
EXECUTE FUNCTION match_ecapris_funding_to_source_and_programs_foreign_keys();

COMMENT ON FUNCTION match_ecapris_funding_to_source_and_programs_foreign_keys() IS 'Attempts matching eCAPRIS funding data to Moped foreign keys using program/subprogram text and bond year.';
COMMENT ON TRIGGER match_ecapris_funding_keys_trigger ON ecapris_subproject_funding IS 'Fires before INSERT or UPDATE on ecapris_subproject_funding to try populating funding_program_id and funding_source_id foreign keys.';


-- Last, update the combind funding view to include eCAPRIS funding source and program info for synced records
DROP VIEW IF EXISTS combined_project_funding_view;

CREATE OR REPLACE VIEW combined_project_funding_view AS SELECT
    'moped_'::TEXT || moped_proj_funding.proj_funding_id AS id,
    moped_proj_funding.proj_funding_id AS original_id,
    moped_proj_funding.created_at,
    moped_proj_funding.updated_at,
    moped_proj_funding.project_id,
    moped_proj_funding.fdu,
    moped_proj_funding.unit_long_name,
    moped_proj_funding.funding_amount AS amount,
    moped_proj_funding.funding_description AS description,
    moped_fund_sources.funding_source_name AS source_name,
    moped_proj_funding.funding_source_id,
    moped_fund_status.funding_status_name AS status_name,
    moped_proj_funding.funding_status_id,
    moped_fund_programs.funding_program_name AS program_name,
    moped_proj_funding.funding_program_id,
    moped_proj_funding.ecapris_funding_id AS fao_id,
    moped_proj_funding.ecapris_subproject_id,
    FALSE AS is_synced_from_ecapris,
    moped_proj_funding.is_manual
FROM moped_proj_funding
LEFT JOIN moped_fund_status ON moped_proj_funding.funding_status_id = moped_fund_status.funding_status_id
LEFT JOIN moped_fund_sources ON moped_proj_funding.funding_source_id = moped_fund_sources.funding_source_id
LEFT JOIN moped_fund_programs ON moped_proj_funding.funding_program_id = moped_fund_programs.funding_program_id
WHERE moped_proj_funding.is_deleted = FALSE
UNION ALL
SELECT
    (('ecapris_'::TEXT || ecapris_subproject_funding.id) || '_moped_'::TEXT) || moped_project.project_id AS id,
    ecapris_subproject_funding.id AS original_id,
    ecapris_subproject_funding.created_at,
    ecapris_subproject_funding.updated_at,
    moped_project.project_id,
    ecapris_subproject_funding.fdu,
    ecapris_subproject_funding.unit_long_name,
    ecapris_subproject_funding.app AS amount,
    NULL::TEXT AS description,
    moped_fund_sources.funding_source_name AS source_name,
    ecapris_subproject_funding.funding_source_id,
    'Set up'::TEXT AS status_name,
    5 AS funding_status_id,
    moped_fund_programs.funding_program_name AS program_name,
    ecapris_subproject_funding.funding_program_id,
    ecapris_subproject_funding.fao_id,
    ecapris_subproject_funding.ecapris_subproject_id,
    TRUE AS is_synced_from_ecapris,
    FALSE AS is_manual
FROM ecapris_subproject_funding
LEFT JOIN moped_fund_sources ON ecapris_subproject_funding.funding_source_id = moped_fund_sources.funding_source_id
LEFT JOIN moped_fund_programs ON ecapris_subproject_funding.funding_program_id = moped_fund_programs.funding_program_id
INNER JOIN moped_project ON ecapris_subproject_funding.ecapris_subproject_id = moped_project.ecapris_subproject_id
WHERE NOT (EXISTS (
        SELECT 1
        FROM moped_proj_funding
        WHERE moped_proj_funding.fdu = ecapris_subproject_funding.fdu AND moped_proj_funding.project_id = moped_project.project_id AND moped_proj_funding.is_deleted = FALSE
    ));
