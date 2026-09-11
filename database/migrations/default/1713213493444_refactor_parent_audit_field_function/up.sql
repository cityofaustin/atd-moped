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
    
    -- Build update to parent table
    query_to_execute = format('
        UPDATE %I SET updated_at = ''%s'', updated_by_user_id = %s WHERE %I.%I = $1.%I RETURNING project_id;', 
        parent_table_name,
        NEW.updated_at,
        -- interpolate NULL as a string to handle when NEW.updated_by_user_id = NULL on CREATE
        quote_nullable(NEW.updated_by_user_id),
        parent_table_name,
        parent_table_primary_key_column_name,
        child_table_foreign_key_name
    );

    -- Execute and store the returned project_id
    EXECUTE query_to_execute USING NEW INTO project_id_variable;

    -- Update the parent project
    UPDATE moped_project
    SET updated_at = NEW.updated_at, updated_by_user_id = NEW.updated_by_user_id
    WHERE project_id = project_id_variable;

    RETURN NEW;
END;
$$
LANGUAGE plpgsql;
