-- Soft delete added sources and programs in future if needed

-- Restore programs
UPDATE moped_fund_programs
SET is_deleted = FALSE
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
SET funding_program_name = 'Safe Routes to Schools'
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

-- No down migration included for source and program updates. We can reference original values 
-- in the activity log and make another up migration if we need to refine more.

-- Drop trigger and then trigger function
DROP TRIGGER IF EXISTS match_ecapris_funding_keys_trigger ON ecapris_subproject_funding;
DROP FUNCTION IF EXISTS match_ecapris_funding_to_source_and_programs_foreign_keys ();

-- Drop added columns from ecapris_subproject_funding
ALTER TABLE ecapris_subproject_funding
DROP COLUMN IF EXISTS bond_year,
DROP COLUMN IF EXISTS funding_source_id,
DROP COLUMN IF EXISTS funding_program_id;
