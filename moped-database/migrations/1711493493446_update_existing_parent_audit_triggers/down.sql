-- Restore the previous function for feature table audit triggers
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

-- Drop current triggers and restore the previous triggers that used the update_parent_records_audit_logs function

-- Drop current feature table triggers
DROP TRIGGER IF EXISTS feature_drawn_lines_parent_audit_log_trigger ON feature_drawn_lines;
DROP TRIGGER IF EXISTS feature_drawn_points_parent_audit_log_trigger ON feature_drawn_points;
DROP TRIGGER IF EXISTS feature_intersections_parent_audit_log_trigger ON feature_intersections;
DROP TRIGGER IF EXISTS feature_signals_parent_audit_log_trigger ON feature_signals;
DROP TRIGGER IF EXISTS feature_street_segments_parent_audit_log_trigger ON feature_street_segments;

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

-- Restore the previous function for project component attributes (tags and work types) audit triggers
CREATE OR REPLACE FUNCTION update_component_attributes_parent_records_audit_logs()
RETURNS TRIGGER AS $$
DECLARE
  project_id_variable INTEGER;
  query TEXT;
BEGIN
  
  -- Update the project component with the current timestamp and user ID
  UPDATE moped_proj_components
  SET updated_at = NEW.updated_at, updated_by_user_id = NEW.updated_by_user_id
  WHERE project_component_id = NEW.project_component_id
  RETURNING project_id INTO project_id_variable;

  -- Update the parent project record with the current timestamp and user ID
  UPDATE moped_project
  SET updated_at = NEW.updated_at, updated_by_user_id = NEW.updated_by_user_id
  WHERE project_id = project_id_variable;

  -- Return the updated record
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
COMMENT ON FUNCTION update_component_attributes_parent_records_audit_logs() IS 'Function to update parent audit fields on update/insert into component attribute tables';

-- Drop current project component tags and work types triggers
DROP TRIGGER IF EXISTS moped_proj_component_work_types_parent_audit_log_trigger ON moped_proj_component_work_types;
DROP TRIGGER IF EXISTS moped_proj_component_tags_parent_audit_log_trigger ON moped_proj_component_tags;

CREATE TRIGGER moped_proj_component_work_types_parent_audit_log_trigger
AFTER INSERT OR UPDATE ON moped_proj_component_work_types
FOR EACH ROW
EXECUTE FUNCTION update_component_attributes_parent_records_audit_logs();

COMMENT ON TRIGGER moped_proj_component_work_types_parent_audit_log_trigger ON moped_proj_component_work_types IS 'Trigger to execute the update_component_attributes_parent_records_audit_logs function before each update operation on the moped_proj_component_work_types table.';

CREATE TRIGGER moped_proj_component_tags_parent_audit_log_trigger
AFTER INSERT OR UPDATE ON moped_proj_component_tags
FOR EACH ROW
EXECUTE FUNCTION update_component_attributes_parent_records_audit_logs();

COMMENT ON TRIGGER moped_proj_component_tags_parent_audit_log_trigger ON moped_proj_component_tags IS 'Trigger to execute the update_component_attributes_parent_records_audit_logs function before each update operation on the moped_proj_component_tags table.';
