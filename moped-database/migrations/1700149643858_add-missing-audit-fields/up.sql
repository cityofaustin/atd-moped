ALTER TABLE moped_project ADD COLUMN updated_by_user_id INTEGER default null;

CREATE OR REPLACE FUNCTION update_parent_records_audit_logs()
RETURNS TRIGGER AS $$
DECLARE
  project_id_variable INTEGER;
  user_id_variable INTEGER;
BEGIN

  SELECT updated_by_user_id INTO user_id_variable
  FROM moped_proj_components
  WHERE project_component_id = NEW.component_id;

  UPDATE moped_proj_components
  set updated_at = now(), updated_by_user_id = user_id_variable
  where project_component_id = NEW.component_id
  returning project_id into project_id_variable;

  update moped_project
  set updated_at = now(), updated_by_user_id = user_id_variable
  where project_id = project_id_variable;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER feature_drawn_lines_parent_audit_log_trigger
AFTER INSERT OR UPDATE ON feature_drawn_lines
FOR EACH ROW
EXECUTE FUNCTION update_parent_records_audit_logs();

CREATE TRIGGER feature_drawn_points_parent_audit_log_trigger
AFTER INSERT OR UPDATE ON feature_drawn_points
FOR EACH ROW
EXECUTE FUNCTION update_parent_records_audit_logs();

CREATE TRIGGER feature_intersections_parent_audit_log_trigger
AFTER INSERT OR UPDATE ON feature_intersections
FOR EACH ROW
EXECUTE FUNCTION update_parent_records_audit_logs();

CREATE TRIGGER feature_signals_trigger
AFTER INSERT OR UPDATE ON feature_signals
FOR EACH ROW
EXECUTE FUNCTION update_parent_records_audit_logs();

CREATE TRIGGER feature_street_segments_trigger
AFTER INSERT OR UPDATE ON feature_street_segments
FOR EACH ROW
EXECUTE FUNCTION update_parent_records_audit_logs();
