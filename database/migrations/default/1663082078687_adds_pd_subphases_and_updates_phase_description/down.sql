-- reverts add subphase "Preliminary Engineering Report" to the "Preliminary Engineering" phase
DELETE FROM moped_subphases  WHERE subphase_name ='Preliminary Engineering Report' and related_phase_id = 3;

-- reverts add the subphase "Bid Preparation" to "Pre-Construction" phase
DELETE FROM moped_subphases WHERE subphase_name ='Bid Preparation' and related_phase_id = 7;

-- reverts add the subphase "Substantially Complete" to the "Post-Construction" phase
DELETE FROM moped_subphases  WHERE subphase_name ='Substantially Complete' and related_phase_id = 10;

--reverts add "bid preparation" to the description of phase "Pre-Construction"
UPDATE moped_phases SET phase_description = 'Project is dealing with permitting, procurement, or other processes needed between design and construction' WHERE phase_id = 7;
