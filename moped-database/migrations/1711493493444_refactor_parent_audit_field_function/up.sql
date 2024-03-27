-- 1711493493446_update_existing_parent_audit_triggers
-- TODO: Update triggers that use the function update_parent_records_audit_logs to use the new function update_audit_fields_with_dynamic_parent_table_name
-- moped-database/migrations/1700515731001_parent_audit_values/up.sql

-- TODO: Update triggers that use the function update_component_attributes_parent_records_audit_logs to use the new function update_audit_fields_with_dynamic_parent_table_name
-- moped-database/migrations/1711054060504_add_component_work_types_tags_audit_fields/up.sql
-- moped-database/migrations/1711493493445_add_comp_subcomp_audit_triggers/up.sql

CREATE OR REPLACE FUNCTION update_audit_fields_with_dynamic_parent_table_name()
RETURNS TRIGGER
AS $$
    DECLARE
        parent_table_name text;
        parent_table_primary_key_column_name text;
        child_table_foreign_key_name text;
        query_to_execute text;
        project_id_variable INTEGER;
BEGIN
    parent_table_name = TG_ARGV[0];
    parent_table_primary_key_column_name = TG_ARGV[1];
    child_table_foreign_key_name = TG_ARGV[2];

    RAISE NOTICE 'parent_table_name: %, parent_table_primary_key_column_name: %, child_table_foreign_key_name: %', parent_table_name, parent_table_primary_key_column_name, child_table_foreign_key_name;
    
    query_to_execute = format('
         UPDATE %I SET updated_at = ''%s'', updated_by_user_id = %s WHERE %I.%I = $1.%I RETURNING project_id;', 
         parent_table_name,
         NEW.updated_at,
         NEW.updated_by_user_id,
         parent_table_name,
         parent_table_primary_key_column_name,
         child_table_foreign_key_name
    );

    EXECUTE query_to_execute USING NEW INTO project_id_variable;

    UPDATE moped_project
    SET updated_at = NEW.updated_at, updated_by_user_id = NEW.updated_by_user_id
    WHERE project_id = project_id_variable;

    RETURN NEW;
END;
$$
LANGUAGE plpgsql;
