alter table moped_phases add column "phase_name_simple" text null;

UPDATE moped_phases SET phase_name_simple = 'Potential' WHERE phase_id = 1;
UPDATE moped_phases SET phase_name_simple = 'Active' WHERE phase_id in (2, 3, 4, 5, 6, 7, 8, 12);
UPDATE moped_phases SET phase_name_simple = 'Construction' WHERE phase_id = 9;
UPDATE moped_phases SET phase_name_simple = 'Complete' WHERE phase_id in (10, 11);
UPDATE moped_phases SET phase_name_simple = 'On hold' WHERE phase_id = 14;
UPDATE moped_phases SET phase_name_simple = 'Canceled' WHERE phase_id = 15;

-- Note there is no record where phase_id = 13
alter table moped_phases alter column "phase_name_simple" set not null;



