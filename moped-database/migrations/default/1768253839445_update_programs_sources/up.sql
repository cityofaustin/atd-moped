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

-- Soft delete programs no longer needed
UPDATE moped_fund_programs
SET is_deleted = TRUE
WHERE funding_program_name = 'Operating Fund' OR funding_program_name = 'Large CIP';

-- Rename programs
UPDATE moped_fund_programs
SET funding_program_name = 'Corridor Program'
WHERE funding_program_name = 'Corridor';

UPDATE moped_fund_programs
SET funding_program_name = 'Local Transit - Local Transit Enhancement'
WHERE funding_program_name = 'Transit Enhancement Program';

-- Update project funding records with existing program value to new program value
UPDATE moped_proj_funding
SET
    funding_program_id = (
        SELECT funding_program_id
        FROM moped_fund_programs
        WHERE funding_program_name = 'Local Transit - Local Transit Enhancement'
    )
FROM moped_fund_programs
WHERE moped_fund_programs.funding_program_name = '2018 Interlocal Agreement';
