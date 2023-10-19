-- For each of phase_start and phase_end date, if the date is on or before 
-- the current date when the record is created or edited then set corresponding
-- confirmation column to true.
CREATE OR REPLACE FUNCTION moped_proj_phases_confirmed_dates() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ 
    BEGIN
        IF NEW.phase_start <= current_date AND NEW.is_phase_start_confirmed != TRUE THEN
            new.is_phase_start_confirmed := true;
        END IF;
        IF NEW.phase_end <= current_date AND NEW.is_phase_end_confirmed != TRUE  THEN
            new.is_phase_end_confirmed := true;
        END IF;
        IF NEW.phase_start > current_date THEN
            new.is_phase_start_confirmed := false;
        END IF;
        IF NEW.phase_end > current_date THEN
            new.is_phase_start_confirmed := false;
        END IF;
        RETURN NEW;
    END;
$$;

CREATE TRIGGER set_moped_proj_phases_confirmed_dates_trigger BEFORE INSERT OR UPDATE ON public.moped_proj_phases
    FOR EACH ROW EXECUTE FUNCTION public.moped_proj_phases_confirmed_dates();
