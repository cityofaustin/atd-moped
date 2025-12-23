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

-- Disable Hasura triggers temporarily to allow direct updates to moped_proj_funding without generating activity log entries
DO $$
BEGIN
    IF EXISTS (
    SELECT 1 
    FROM pg_trigger 
    WHERE tgname = 'notify_hasura_activity_log_moped_proj_funding_UPDATE'
        AND tgrelid = 'moped_proj_funding'::regclass
    ) THEN
        ALTER TABLE moped_proj_funding 
        DISABLE TRIGGER "notify_hasura_activity_log_moped_proj_funding_UPDATE";
    ELSE
    RAISE NOTICE 'Trigger does not exist, skipping';
    END IF;

    IF EXISTS (
        SELECT 1 
        FROM pg_trigger 
        WHERE tgname = 'update_moped_proj_funding_and_project_audit_fields'
        AND tgrelid = 'moped_proj_funding'::regclass
    ) THEN
        ALTER TABLE moped_proj_funding 
        DISABLE TRIGGER "update_moped_proj_funding_and_project_audit_fields";
    ELSE
        RAISE NOTICE 'Trigger does not exist, skipping';
    END IF;

    IF EXISTS (
        SELECT 1 
        FROM pg_trigger 
        WHERE tgname = 'set_moped_project_updated_at'
        AND tgrelid = 'moped_project'::regclass
    ) THEN
        ALTER TABLE moped_project 
        DISABLE TRIGGER "set_moped_project_updated_at";
    ELSE
        RAISE NOTICE 'Trigger does not exist, skipping';
    END IF;
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
    IF EXISTS (
    SELECT 1 
    FROM pg_trigger 
    WHERE tgname = 'notify_hasura_activity_log_moped_proj_funding_UPDATE'
        AND tgrelid = 'moped_proj_funding'::regclass
    ) THEN
        ALTER TABLE moped_proj_funding 
        ENABLE TRIGGER "notify_hasura_activity_log_moped_proj_funding_UPDATE";
    ELSE
    RAISE NOTICE 'Trigger does not exist, skipping';
    END IF;

    IF EXISTS (
        SELECT 1 
        FROM pg_trigger 
        WHERE tgname = 'update_moped_proj_funding_and_project_audit_fields'
        AND tgrelid = 'moped_proj_funding'::regclass
    ) THEN
        ALTER TABLE moped_proj_funding 
        ENABLE TRIGGER "update_moped_proj_funding_and_project_audit_fields";
    ELSE
        RAISE NOTICE 'Trigger does not exist, skipping';
    END IF;

    IF EXISTS (
        SELECT 1 
        FROM pg_trigger 
        WHERE tgname = 'set_moped_project_updated_at'
        AND tgrelid = 'moped_project'::regclass
    ) THEN
        ALTER TABLE moped_project 
        ENABLE TRIGGER "set_moped_project_updated_at";
    ELSE
        RAISE NOTICE 'Trigger does not exist, skipping';
    END IF;
END $$;
