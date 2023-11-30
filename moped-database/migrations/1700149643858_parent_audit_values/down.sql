-- Dropping triggers for different feature tables

DROP TRIGGER IF EXISTS feature_drawn_lines_parent_audit_log_trigger ON feature_drawn_lines;
DROP TRIGGER IF EXISTS feature_drawn_points_parent_audit_log_trigger ON feature_drawn_points;
DROP TRIGGER IF EXISTS feature_intersections_parent_audit_log_trigger ON feature_intersections;
DROP TRIGGER IF EXISTS feature_signals_trigger ON feature_signals;
DROP TRIGGER IF EXISTS feature_street_segments_trigger ON feature_street_segments;

-- Dropping the function update_parent_records_audit_logs

DROP FUNCTION IF EXISTS update_parent_records_audit_logs();

-- Removing the column updated_by_user_id from moped_project table

ALTER TABLE moped_project DROP COLUMN IF EXISTS updated_by_user_id;
