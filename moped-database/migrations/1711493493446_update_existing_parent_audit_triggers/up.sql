-- TODO: Update triggers that use the function update_parent_records_audit_logs to use the new function update_audit_fields_with_dynamic_parent_table_name
-- moped-database/migrations/1700515731001_parent_audit_values/up.sql

-- Drop current feature table triggers
DROP TRIGGER feature_drawn_lines_parent_audit_log_trigger ON feature_drawn_lines;
DROP TRIGGER feature_drawn_points_parent_audit_log_trigger ON feature_drawn_points;
DROP TRIGGER feature_intersections_parent_audit_log_trigger ON feature_intersections;
DROP TRIGGER feature_signals_parent_audit_log_trigger ON feature_signals;
DROP TRIGGER feature_street_segments_parent_audit_log_trigger ON feature_street_segments;

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


-- TODO: Update triggers that use the function update_component_attributes_parent_records_audit_logs to use the new function update_audit_fields_with_dynamic_parent_table_name
-- moped-database/migrations/1711054060504_add_component_work_types_tags_audit_fields/up.sql
-- moped-database/migrations/1711493493445_add_comp_subcomp_audit_triggers/up.sql
