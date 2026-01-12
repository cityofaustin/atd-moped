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
SELECT 'Vision Zero - Major Safety' WHERE NOT EXISTS (
        SELECT 1 FROM moped_fund_programs
        WHERE funding_program_name = 'Vision Zero - Major Safety'
    );

INSERT INTO moped_fund_programs (funding_program_name)
SELECT 'Vision Zero - Pedestrian Safety' WHERE NOT EXISTS (
        SELECT 1 FROM moped_fund_programs
        WHERE funding_program_name = 'Vision Zero - Pedestrian Safety'
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

-- Add sources
INSERT INTO moped_fund_sources (funding_source_name)
SELECT 'Highway Safety Improvements' WHERE NOT EXISTS (
        SELECT 1 FROM moped_fund_sources
        WHERE funding_source_name = 'Highway Safety Improvements'
    );


-- Soft delete programs no longer needed
UPDATE moped_fund_programs
SET is_deleted = TRUE
WHERE funding_program_name = 'Operating Fund'
    OR funding_program_name = 'Large CIP'
    OR funding_program_name = '2018 Interlocal Agreement'
    OR funding_program_name = 'Intersection Safety'
    OR funding_program_name = 'Pedestrian Crossing'
    OR funding_program_name = 'Highway Safety Improvements'
    OR funding_program_name = 'IH35';

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

-- Update project funding records with existing program value to new program value
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
