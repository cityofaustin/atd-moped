UPDATE moped_proj_phases SET is_phase_start_confirmed = false WHERE phase_start <= current_date;
UPDATE moped_proj_phases SET is_phase_end_confirmed = false WHERE phase_end <= current_date;
