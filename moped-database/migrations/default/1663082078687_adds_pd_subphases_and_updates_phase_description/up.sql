-- add subphase "Preliminary Engineering Report" to the "Preliminary Engineering" phase
INSERT INTO moped_subphases (subphase_name, subphase_order, related_phase_id) VALUES ('Preliminary Engineering Report', 22, 3);

-- add the subphase "Bid Preparation" to "Pre-Construction" phase
INSERT INTO moped_subphases (subphase_name, subphase_order, related_phase_id) VALUES ('Bid Preparation', 23, 7);

-- add the subphase "Substantially Complete" to the "Post-Construction" phase
INSERT INTO moped_subphases (subphase_name, subphase_order, related_phase_id) VALUES ('Substantially Complete', 24, 10);

-- Add "bid preparation" to the description of phase "Pre-Construction"
UPDATE moped_phases SET phase_description = 'Project is dealing with bid preparation, permitting, procurement, or other processes needed between design and construction' WHERE phase_id = 7;
