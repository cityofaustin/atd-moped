ALTER TABLE feature_drawn_lines
DROP COLUMN created_at,
DROP COLUMN created_by_user_id,
DROP COLUMN updated_by_user_id,
DROP COLUMN updated_at;

ALTER TABLE feature_drawn_points
DROP COLUMN created_at,
DROP COLUMN created_by_user_id,
DROP COLUMN updated_by_user_id,
DROP COLUMN updated_at;

ALTER TABLE feature_intersections
DROP COLUMN created_at,
DROP COLUMN created_by_user_id,
DROP COLUMN updated_by_user_id,
DROP COLUMN updated_at;

ALTER TABLE feature_signals
DROP COLUMN created_at,
DROP COLUMN created_by_user_id,
DROP COLUMN updated_by_user_id,
DROP COLUMN updated_at;

ALTER TABLE feature_street_segments
DROP COLUMN created_at,
DROP COLUMN created_by_user_id,
DROP COLUMN updated_by_user_id,
DROP COLUMN updated_at;
