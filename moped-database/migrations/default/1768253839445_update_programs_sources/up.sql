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

-- Soft delete programs no longer needed
UPDATE moped_fund_programs
SET is_deleted = TRUE
WHERE funding_program_name = 'Operating Fund' OR funding_program_name = 'Large CIP' OR funding_program_name = '2018 Interlocal Agreement';

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
