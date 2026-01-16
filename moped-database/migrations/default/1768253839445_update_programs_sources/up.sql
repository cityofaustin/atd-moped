-- Add programs available from program tagging that are not in Moped
INSERT INTO moped_fund_programs (funding_program_name)
SELECT 'Bridges & Structures' WHERE NOT EXISTS (
        SELECT 1 FROM moped_fund_programs
        WHERE funding_program_name = 'Bridges & Structure'
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
SELECT 'Vision Zero - Systemic Safety' WHERE NOT EXISTS (
        SELECT 1 FROM moped_fund_programs
        WHERE funding_program_name = 'Vision Zero - Systemic Safety'
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

-- Soft delete programs no longer needed
UPDATE moped_fund_programs
SET is_deleted = TRUE
WHERE funding_program_name = 'Operating Fund'
    OR funding_program_name = 'Large CIP'
    OR funding_program_name = '2018 Interlocal Agreement'
    OR funding_program_name = 'Pedestrian Crossing'
    OR funding_program_name = 'Highway Safety Improvements'
    OR funding_program_name = 'IH35'
    OR funding_program_name = 'Mitigation Fees'
    OR funding_program_name = 'Traffic Mitigation Fees'
    OR funding_program_name = 'Project Development'
    OR funding_program_name = 'Sidewalk Fee in Lieu'
    OR funding_program_name = 'Sidewalk Rehab'
    OR funding_program_name = 'Street & Bridge Operations'
    OR funding_program_name = 'Transportation Enhancements 2009 Grant';

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
WHERE funding_program_name = 'Safe Routes to School';

UPDATE moped_fund_programs
SET funding_program_name = 'Signals'
WHERE funding_program_name = 'Traffic Signals';

UPDATE moped_fund_programs
SET funding_program_name = 'Vision Zero - Major Safety'
WHERE funding_program_name = 'Intersection Safety';

UPDATE moped_fund_programs
SET funding_program_name = 'Vision Zero - Pedestrian Safety'
WHERE funding_program_name = 'Pedestrian Crossing';

UPDATE moped_fund_programs
SET funding_program_name = 'Vision Zero - Speed Management'
WHERE funding_program_name = 'Speed Management';

-- Update project funding records with 2018 Interlocal Agreement program to new Local Transit - Local Transit Enhancement program
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

-- Update project funding records with Mitigation Fee and Traffic Mitigation Fees programs to new Developer Transportation Improvements Program
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

-- Update project funding records with 2018 Interlocal Agreement program to new Transit ILA 2018 source
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

-- TODO: Add trigger to attempt assigning program foreign key on insert/update of eCAPRIS funding records
-- TODO: Add trigger to attemp assigning source foreign key on insert/update of eCAPRIS funding records
