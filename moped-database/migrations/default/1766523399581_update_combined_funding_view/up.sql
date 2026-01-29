-- Update view to filter moped_proj_funding rows by project id
CREATE OR REPLACE VIEW combined_project_funding_view AS SELECT
    'moped_'::text || moped_proj_funding.proj_funding_id AS id,
    moped_proj_funding.proj_funding_id AS original_id,
    moped_proj_funding.created_at,
    moped_proj_funding.updated_at,
    moped_proj_funding.project_id,
    moped_proj_funding.fdu,
    moped_proj_funding.unit_long_name,
    moped_proj_funding.funding_amount AS amount,
    moped_proj_funding.funding_description AS description,
    moped_fund_sources.funding_source_name AS source_name,
    moped_proj_funding.funding_source_id,
    moped_fund_status.funding_status_name AS status_name,
    moped_proj_funding.funding_status_id,
    moped_fund_programs.funding_program_name AS program_name,
    moped_proj_funding.funding_program_id,
    NULL::integer AS fao_id,
    NULL::text AS ecapris_subproject_id,
    FALSE AS is_synced_from_ecapris
FROM moped_proj_funding
LEFT JOIN moped_fund_status ON moped_proj_funding.funding_status_id = moped_fund_status.funding_status_id
LEFT JOIN moped_fund_sources ON moped_proj_funding.funding_source_id = moped_fund_sources.funding_source_id
LEFT JOIN moped_fund_programs ON moped_proj_funding.funding_program_id = moped_fund_programs.funding_program_id
WHERE moped_proj_funding.is_deleted = FALSE
UNION ALL
SELECT
    'ecapris_'::text || ecapris_subproject_funding.id || '_moped_' || moped_project.project_id AS id,
    ecapris_subproject_funding.id AS original_id,
    ecapris_subproject_funding.created_at,
    ecapris_subproject_funding.updated_at,
    moped_project.project_id,
    ecapris_subproject_funding.fdu,
    ecapris_subproject_funding.unit_long_name,
    ecapris_subproject_funding.app AS amount,
    NULL AS description,
    NULL::text AS source_name,
    NULL::integer AS funding_source_id,
    'Set up'::text AS status_name,
    5 AS funding_status_id,
    NULL::text AS program_name,
    NULL::integer AS funding_program_id,
    ecapris_subproject_funding.fao_id,
    ecapris_subproject_funding.ecapris_subproject_id,
    TRUE AS is_synced_from_ecapris
FROM ecapris_subproject_funding
INNER JOIN moped_project ON ecapris_subproject_funding.ecapris_subproject_id = moped_project.ecapris_subproject_id
WHERE NOT (EXISTS (
        SELECT 1
        FROM moped_proj_funding
        WHERE moped_proj_funding.fdu = ecapris_subproject_funding.fdu
            AND moped_proj_funding.project_id = moped_project.project_id
            AND moped_proj_funding.is_deleted = FALSE
    ));

-- Create helper to turn triggers on or off as needed
CREATE OR REPLACE FUNCTION manage_trigger(
    trigger_name text,
    table_name regclass,
    should_enable boolean DEFAULT FALSE
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    trigger_action text := CASE WHEN should_enable THEN 'ENABLE' ELSE 'DISABLE' END;
BEGIN
    -- Check if trigger exists to support local start from seed data and also avoid errors
    IF EXISTS (
        SELECT 1 
        FROM pg_trigger 
        WHERE tgname = trigger_name
        AND tgrelid = table_name
    ) THEN
        EXECUTE format('ALTER TABLE %s %s TRIGGER %I', 
            table_name, 
            trigger_action, 
            trigger_name
        );
        RAISE NOTICE '% trigger % on table %', trigger_action, trigger_name, table_name;
    ELSE
        RAISE NOTICE 'Trigger % does not exist on table %, skipping', trigger_name, table_name;
    END IF;
END;
$$;

-- Disable Hasura triggers temporarily to allow direct updates to moped_proj_funding without generating activity log entries
DO $$
BEGIN
    PERFORM manage_trigger('notify_hasura_activity_log_moped_proj_funding_UPDATE', 'moped_proj_funding', FALSE);
    PERFORM manage_trigger('update_moped_proj_funding_and_project_audit_fields', 'moped_proj_funding', FALSE);
    PERFORM manage_trigger('set_moped_project_updated_at', 'moped_project', FALSE);
END $$;

-- Populate new fdu column based on existing fund_dept_unit data if available and 
-- populate unit_long_name from dept_unit JSONB
-- Note: fund_dept_unit is a generated column that is null if fund or dept_unit is null
UPDATE moped_proj_funding
SET
    fdu = fund_dept_unit,
    unit_long_name = (dept_unit ->> 'unit_long_name')
WHERE fund_dept_unit IS NOT NULL;

-- Mark all existing funding records as legacy before eCAPRIS sync integration launches
UPDATE moped_proj_funding
SET is_legacy_funding_record = TRUE;

-- Re-enable Hasura triggers
DO $$
BEGIN
    PERFORM manage_trigger('notify_hasura_activity_log_moped_proj_funding_UPDATE', 'moped_proj_funding', TRUE);
    PERFORM manage_trigger('update_moped_proj_funding_and_project_audit_fields', 'moped_proj_funding', TRUE);
    PERFORM manage_trigger('set_moped_project_updated_at', 'moped_project', TRUE);
END $$;

COMMENT ON FUNCTION public.manage_trigger(text, regclass, boolean) IS 'Safely enables or disables a trigger on a table, checking for existence first to avoid errors.';
