UPDATE moped_proj_phases SET is_phase_start_confirmed = true WHERE phase_start <= current_date;
UPDATE moped_proj_phases SET is_phase_end_confirmed = true WHERE phase_end <= current_date;

