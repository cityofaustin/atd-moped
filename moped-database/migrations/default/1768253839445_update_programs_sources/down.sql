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

-- Restore project funding records with existing program value to new program value
UPDATE moped_proj_funding
SET
    funding_program_id = (
        SELECT funding_program_id
        FROM moped_fund_programs
        WHERE funding_program_name = '2018 Interlocal Agreement'
    )
FROM moped_fund_programs
WHERE moped_fund_programs.funding_program_name = 'Local Transit - Local Transit Enhancement';
