-- Altering moped_project table to add a new column for tracking the user who last updated a record
ALTER TABLE moped_project ADD COLUMN updated_by_user_id INTEGER DEFAULT NULL;
COMMENT ON COLUMN moped_project.updated_by_user_id IS 'User ID of the person who last updated the project';

-- Creating or replacing a function to update audit logs in parent records
CREATE OR REPLACE FUNCTION update_parent_records_audit_logs()
RETURNS TRIGGER AS $$
DECLARE
  project_id_variable INTEGER;
  query TEXT;
BEGIN
  
  -- Update the project component with the current timestamp and user ID
  UPDATE moped_proj_components
  SET updated_at = NEW.updated_at, updated_by_user_id = NEW.updated_by_user_id
  WHERE project_component_id = NEW.component_id
  RETURNING project_id INTO project_id_variable;

  -- Update the parent project record with the current timestamp and user ID
  UPDATE moped_project
  SET updated_at = NEW.updated_at, updated_by_user_id = NEW.updated_by_user_id
  WHERE project_id = project_id_variable;

  -- Return the updated record
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
COMMENT ON FUNCTION update_parent_records_audit_logs() IS 'Function to update parent audit fields on update/insert into feature tables';

-- Creating triggers for different feature tables to execute the function after insert or update operations

-- Trigger for feature_drawn_lines table
CREATE TRIGGER feature_drawn_lines_parent_audit_log_trigger
AFTER INSERT OR UPDATE ON feature_drawn_lines
FOR EACH ROW
EXECUTE FUNCTION update_parent_records_audit_logs();
COMMENT ON TRIGGER feature_drawn_lines_parent_audit_log_trigger ON feature_drawn_lines IS 'Trigger to update parent project and component audit fields';

-- Trigger for feature_drawn_points table
CREATE TRIGGER feature_drawn_points_parent_audit_log_trigger
AFTER INSERT OR UPDATE ON feature_drawn_points
FOR EACH ROW
EXECUTE FUNCTION update_parent_records_audit_logs();
COMMENT ON TRIGGER feature_drawn_points_parent_audit_log_trigger ON feature_drawn_points IS 'Trigger to update parent project and component audit fields';

-- Trigger for feature_intersections table
CREATE TRIGGER feature_intersections_parent_audit_log_trigger
AFTER INSERT OR UPDATE ON feature_intersections
FOR EACH ROW
EXECUTE FUNCTION update_parent_records_audit_logs();
COMMENT ON TRIGGER feature_intersections_parent_audit_log_trigger ON feature_intersections IS 'Trigger to update parent project and component audit fields';

-- Trigger for feature_signals table
CREATE TRIGGER feature_signals_parent_audit_log_trigger
AFTER INSERT OR UPDATE ON feature_signals
FOR EACH ROW
EXECUTE FUNCTION update_parent_records_audit_logs();
COMMENT ON TRIGGER feature_signals_parent_audit_log_trigger ON feature_signals IS 'Trigger to update parent project and component audit fields';

-- Trigger for feature_street_segments table
CREATE TRIGGER feature_street_segments_parent_audit_log_trigger
AFTER INSERT OR UPDATE ON feature_street_segments
FOR EACH ROW
EXECUTE FUNCTION update_parent_records_audit_logs();
COMMENT ON TRIGGER feature_street_segments_parent_audit_log_trigger ON feature_street_segments IS 'Trigger to update parent project and component audit fields';
