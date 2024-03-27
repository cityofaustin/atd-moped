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
BEGIN
    parent_table_name = TG_ARGV[0];
    parent_table_primary_key_column_name = TG_ARGV [1];
    child_table_foreign_key_name = TG_ARGV[2];
    
    query_to_execute = format('
         UPDATE %I set updated_at = ''%s'', updated_by_user_id = %s WHERE %I.%I = $1.%I', 
         parent_table_name,
         NEW.updated_at,
         NEW.updated_by_user_id,
         parent_table_name,
         parent_table_primary_key_column_name,
         child_table_foreign_key_name
    );

    EXECUTE query_to_execute USING NEW;

    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER update_audit_fields_trigger
AFTER INSERT OR UPDATE ON child_table
FOR EACH ROW
EXECUTE PROCEDURE update_audit_fields_with_dynamic_parent_table_name('parent_table', 'id', 'parent_id');
