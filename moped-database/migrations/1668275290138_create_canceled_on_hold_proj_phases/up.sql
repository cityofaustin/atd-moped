-- insert an on hold phase for projects which have an on hold status
DO $$
DECLARE
    project_id int;
BEGIN
    FOR project_id IN
    SELECT
        mp.project_id
    FROM
        moped_project mp
    WHERE
        current_status = 'on hold' LOOP
            INSERT INTO moped_proj_phases (project_id, phase_id, is_current_phase, completion_percentage, completed)
                VALUES(project_id, 14, TRUE, 0, FALSE);
        END LOOP;
    END$$;

-- insert a canceled project phase for projects which have a canceled status
DO $$
DECLARE
    project_id int;
BEGIN
    FOR project_id IN
    SELECT
        mp.project_id
    FROM
        moped_project mp
    WHERE
        current_status = 'canceled' LOOP
            INSERT INTO moped_proj_phases (project_id, phase_id, is_current_phase, completion_percentage, completed)
                VALUES(project_id, 15, TRUE, 0, FALSE);
        END LOOP;
    END$$;
