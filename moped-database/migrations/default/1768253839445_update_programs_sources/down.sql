-- Soft delete added in future if needed

-- Restore programs
UPDATE moped_fund_programs
SET is_deleted = FALSE
WHERE funding_program_name = 'Operating Fund' OR funding_program_name = 'Large CIP';

-- Restore renamed programs
UPDATE moped_fund_programs
SET funding_program_name = 'Corridor'
WHERE funding_program_name = 'Corridor Program';

UPDATE moped_fund_programs
SET funding_program_name = 'Transit Enhancement Program'
WHERE funding_program_name = 'Local Transit - Local Transit Enhancement';

UPDATE moped_fund_programs
SET funding_program_name = 'Regional Mobility'
WHERE funding_program_name = 'Regional';

UPDATE moped_fund_programs
SET funding_program_name = 'Safe Routes to School'
WHERE funding_program_name = 'Safe Routes';

UPDATE moped_fund_programs
SET funding_program_name = 'Traffic Signals'
WHERE funding_program_name = 'Signals';

UPDATE moped_fund_programs
SET funding_program_name = 'Intersection Safety'
WHERE funding_program_name = 'Vision Zero - Major Safety';

UPDATE moped_fund_programs
SET funding_program_name = 'Pedestrian Crossing'
WHERE funding_program_name = 'Vision Zero - Pedestrian Safety';

UPDATE moped_fund_programs
SET funding_program_name = 'Speed Management'
WHERE funding_program_name = 'Vision Zero - Speed Management';

-- Restore updated project funding records with existing program value to new program value
WITH
updated_program AS (
    SELECT funding_program_id
    FROM
        moped_fund_programs
    WHERE
        funding_program_name = '2018 Interlocal Agreement'
)

UPDATE moped_proj_funding
SET
    funding_program_id = updated_program.funding_program_id
FROM
    updated_program,
    moped_fund_programs
WHERE
    moped_proj_funding.funding_program_id = moped_fund_programs.funding_program_id
    AND moped_fund_programs.funding_program_name = 'Local Transit - Local Transit Enhancement';

-- Can't undo Mitigation Fee and Traffic Mitigation Fees reassignment to Developer Transportation Improvements Program
-- because we don't know which of the two original programs to assign back to.
