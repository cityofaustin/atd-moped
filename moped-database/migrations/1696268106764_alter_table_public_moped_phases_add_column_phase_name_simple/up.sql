alter table moped_phases add column "phase_name_simple" text null;

UPDATE moped_phases SET phase_name_simple = 'Complete' WHERE phase_id in (1, 2);
UPDATE moped_phases SET phase_name_simple = 'Construction' WHERE phase_id = 3;
UPDATE moped_phases SET phase_name_simple = 'Active' WHERE phase_id in (4, 5, 6, 7, 8, 9, 10, 12);
UPDATE moped_phases SET phase_name_simple = 'Potential' WHERE phase_id in (11, 14);
UPDATE moped_phases SET phase_name_simple = 'Complete' WHERE phase_id = 15;

-- Note there is no record where phase_id = 13
alter table moped_phases alter column "phase_name_simple" set not null;



