-- Drop current feature table triggers that use update_parent_records_audit_logs function
DROP TRIGGER IF EXISTS feature_drawn_lines_parent_audit_log_trigger ON feature_drawn_lines;
DROP TRIGGER IF EXISTS feature_drawn_points_parent_audit_log_trigger ON feature_drawn_points;
DROP TRIGGER IF EXISTS feature_intersections_parent_audit_log_trigger ON feature_intersections;
DROP TRIGGER IF EXISTS feature_signals_parent_audit_log_trigger ON feature_signals;
DROP TRIGGER IF EXISTS feature_street_segments_parent_audit_log_trigger ON feature_street_segments;

-- Now, add them back with the update_audit_fields_with_dynamic_parent_table_name function

-- Trigger for feature_drawn_lines table
CREATE TRIGGER feature_drawn_lines_parent_audit_log_trigger
AFTER INSERT OR UPDATE ON feature_drawn_lines
FOR EACH ROW
EXECUTE FUNCTION update_audit_fields_with_dynamic_parent_table_name("moped_proj_components", "project_component_id", "component_id");
COMMENT ON TRIGGER feature_drawn_lines_parent_audit_log_trigger ON feature_drawn_lines IS 'Trigger to update parent project and component audit fields';

-- Trigger for feature_drawn_points table
CREATE TRIGGER feature_drawn_points_parent_audit_log_trigger
AFTER INSERT OR UPDATE ON feature_drawn_points
FOR EACH ROW
EXECUTE FUNCTION update_audit_fields_with_dynamic_parent_table_name("moped_proj_components", "project_component_id", "component_id");
COMMENT ON TRIGGER feature_drawn_points_parent_audit_log_trigger ON feature_drawn_points IS 'Trigger to update parent project and component audit fields';

-- Trigger for feature_intersections table
CREATE TRIGGER feature_intersections_parent_audit_log_trigger
AFTER INSERT OR UPDATE ON feature_intersections
FOR EACH ROW
EXECUTE FUNCTION update_audit_fields_with_dynamic_parent_table_name("moped_proj_components", "project_component_id", "component_id");
COMMENT ON TRIGGER feature_intersections_parent_audit_log_trigger ON feature_intersections IS 'Trigger to update parent project and component audit fields';

-- Trigger for feature_signals table
CREATE TRIGGER feature_signals_parent_audit_log_trigger
AFTER INSERT OR UPDATE ON feature_signals
FOR EACH ROW
EXECUTE FUNCTION update_audit_fields_with_dynamic_parent_table_name("moped_proj_components", "project_component_id", "component_id");
COMMENT ON TRIGGER feature_signals_parent_audit_log_trigger ON feature_signals IS 'Trigger to update parent project and component audit fields';

-- Trigger for feature_street_segments table
CREATE TRIGGER feature_street_segments_parent_audit_log_trigger
AFTER INSERT OR UPDATE ON feature_street_segments
FOR EACH ROW
EXECUTE FUNCTION update_audit_fields_with_dynamic_parent_table_name("moped_proj_components", "project_component_id", "component_id");
COMMENT ON TRIGGER feature_street_segments_parent_audit_log_trigger ON feature_street_segments IS 'Trigger to update parent project and component audit fields';

-- Drop current project component tags and work types triggers that use update_component_attributes_parent_records_audit_logs function
DROP TRIGGER IF EXISTS moped_proj_component_work_types_parent_audit_log_trigger ON moped_proj_component_work_types;
DROP TRIGGER IF EXISTS moped_proj_component_tags_parent_audit_log_trigger ON moped_proj_component_tags;

-- Now, add them back with the update_audit_fields_with_dynamic_parent_table_name function

-- Trigger for moped_proj_component_work_types table
CREATE TRIGGER moped_proj_component_work_types_parent_audit_log_trigger
AFTER INSERT OR UPDATE ON moped_proj_component_work_types
FOR EACH ROW
EXECUTE FUNCTION update_audit_fields_with_dynamic_parent_table_name("moped_proj_components", "project_component_id", "project_component_id");
COMMENT ON TRIGGER moped_proj_component_work_types_parent_audit_log_trigger ON moped_proj_component_work_types IS 'Trigger to update parent project and component audit fields';

-- Trigger for moped_proj_component_tags table
CREATE TRIGGER moped_proj_component_tags_parent_audit_log_trigger
AFTER INSERT OR UPDATE ON moped_proj_component_tags
FOR EACH ROW
EXECUTE FUNCTION update_audit_fields_with_dynamic_parent_table_name("moped_proj_components", "project_component_id", "project_component_id");
COMMENT ON TRIGGER moped_proj_component_tags_parent_audit_log_trigger ON moped_proj_component_tags IS 'Trigger to update parent project and component audit fields';

-- Drop the previous functions
DROP FUNCTION IF EXISTS update_parent_records_audit_logs;
DROP FUNCTION IF EXISTS update_component_attributes_parent_records_audit_logs;

-- Last, update the updated_at column default value for the feature tables
ALTER TABLE feature_drawn_lines ALTER COLUMN updated_at SET DEFAULT now();
ALTER TABLE feature_drawn_points ALTER COLUMN updated_at SET DEFAULT now();
ALTER TABLE feature_intersections ALTER COLUMN updated_at SET DEFAULT now();
ALTER TABLE feature_signals ALTER COLUMN updated_at SET DEFAULT now();
ALTER TABLE feature_street_segments ALTER COLUMN updated_at SET DEFAULT now();
