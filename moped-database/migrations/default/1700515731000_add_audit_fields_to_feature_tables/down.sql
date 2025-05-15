-- Removing triggers for feature_drawn_lines
DROP TRIGGER IF EXISTS set_feature_drawn_lines_updated_at ON public.feature_drawn_lines;

-- Removing triggers for feature_drawn_points
DROP TRIGGER IF EXISTS set_feature_drawn_points_updated_at ON public.feature_drawn_points;

-- Removing triggers for feature_intersections
DROP TRIGGER IF EXISTS set_feature_intersections_updated_at ON public.feature_intersections;

-- Removing triggers for feature_signals
DROP TRIGGER IF EXISTS set_feature_signals_updated_at ON public.feature_signals;

-- Removing triggers for feature_street_segments
DROP TRIGGER IF EXISTS set_feature_street_segments_updated_at ON public.feature_street_segments;


-- Dropping foreign key constraints for feature_drawn_lines
ALTER TABLE feature_drawn_lines DROP CONSTRAINT IF EXISTS fk_feature_drawn_lines_created_by;
ALTER TABLE feature_drawn_lines DROP CONSTRAINT IF EXISTS fk_feature_drawn_lines_updated_by;

-- Dropping foreign key constraints for feature_drawn_points
ALTER TABLE feature_drawn_points DROP CONSTRAINT IF EXISTS fk_feature_drawn_points_created_by;
ALTER TABLE feature_drawn_points DROP CONSTRAINT IF EXISTS fk_feature_drawn_points_updated_by;

-- Dropping foreign key constraints for feature_intersections
ALTER TABLE feature_intersections DROP CONSTRAINT IF EXISTS fk_feature_intersections_created_by;
ALTER TABLE feature_intersections DROP CONSTRAINT IF EXISTS fk_feature_intersections_updated_by;

-- Dropping foreign key constraints for feature_signals
ALTER TABLE feature_signals DROP CONSTRAINT IF EXISTS fk_feature_signals_created_by;
ALTER TABLE feature_signals DROP CONSTRAINT IF EXISTS fk_feature_signals_updated_by;

-- Dropping foreign key constraints for feature_street_segments
ALTER TABLE feature_street_segments DROP CONSTRAINT IF EXISTS fk_feature_street_segments_created_by;
ALTER TABLE feature_street_segments DROP CONSTRAINT IF EXISTS fk_feature_street_segments_updated_by;


-- Dropping columns for feature_drawn_lines
ALTER TABLE feature_drawn_lines
DROP COLUMN IF EXISTS created_at,
DROP COLUMN IF EXISTS created_by_user_id,
DROP COLUMN IF EXISTS updated_by_user_id,
DROP COLUMN IF EXISTS updated_at;

-- Dropping columns for feature_drawn_points
ALTER TABLE feature_drawn_points
DROP COLUMN IF EXISTS created_at,
DROP COLUMN IF EXISTS created_by_user_id,
DROP COLUMN IF EXISTS updated_by_user_id,
DROP COLUMN IF EXISTS updated_at;

-- Dropping columns for feature_intersections
ALTER TABLE feature_intersections
DROP COLUMN IF EXISTS created_at,
DROP COLUMN IF EXISTS created_by_user_id,
DROP COLUMN IF EXISTS updated_by_user_id,
DROP COLUMN IF EXISTS updated_at;

-- Dropping columns for feature_signals
ALTER TABLE feature_signals
DROP COLUMN IF EXISTS created_at,
DROP COLUMN IF EXISTS created_by_user_id,
DROP COLUMN IF EXISTS updated_by_user_id,
DROP COLUMN IF EXISTS updated_at;

-- Dropping columns for feature_street_segments
ALTER TABLE feature_street_segments
DROP COLUMN IF EXISTS created_at,
DROP COLUMN IF EXISTS created_by_user_id,
DROP COLUMN IF EXISTS updated_by_user_id,
DROP COLUMN IF EXISTS updated_at;
