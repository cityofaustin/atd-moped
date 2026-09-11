-- copy work_assignment_id from moped_project into new moped_proj_contract_records
DO $$
DECLARE
    project record;
BEGIN
    FOR project IN
    SELECT
        project_id,
        work_assignment_id
    FROM
        moped_project
    WHERE
        work_assignment_id IS NOT NULL LOOP
            INSERT INTO moped_proj_contract (project_id, work_assignment_id)
                values(project.project_id, project.work_assignment_id);
        END LOOP;
    END$$;

-- drop unused columns
ALTER TABLE moped_project
    DROP COLUMN project_uuid,
    DROP COLUMN project_description_public,
    DROP COLUMN project_importance,
    DROP COLUMN project_order,
    DROP COLUMN timeline_id,
    DROP COLUMN end_date,
    DROP COLUMN project_length,
    DROP COLUMN fiscal_year,
    DROP COLUMN project_priority,
    DROP COLUMN milestone_id,
    DROP COLUMN work_assignment_id;
