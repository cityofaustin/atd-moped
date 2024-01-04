ALTER TABLE feature_drawn_lines
ADD COLUMN created_at timestamptz NOT NULL DEFAULT now(),
ADD COLUMN created_by_user_id int4 NULL,
ADD COLUMN updated_by_user_id int4 NULL,
ADD COLUMN updated_at timestamptz NULL;

ALTER TABLE feature_drawn_points
ADD COLUMN created_at timestamptz NOT NULL DEFAULT now(),
ADD COLUMN created_by_user_id int4 NULL,
ADD COLUMN updated_by_user_id int4 NULL,
ADD COLUMN updated_at timestamptz NULL;

ALTER TABLE feature_intersections
ADD COLUMN created_at timestamptz NOT NULL DEFAULT now(),
ADD COLUMN created_by_user_id int4 NULL,
ADD COLUMN updated_by_user_id int4 NULL,
ADD COLUMN updated_at timestamptz NULL;

ALTER TABLE feature_signals
ADD COLUMN created_at timestamptz NOT NULL DEFAULT now(),
ADD COLUMN created_by_user_id int4 NULL,
ADD COLUMN updated_by_user_id int4 NULL,
ADD COLUMN updated_at timestamptz NULL;

ALTER TABLE feature_street_segments
ADD COLUMN created_at timestamptz NOT NULL DEFAULT now(),
ADD COLUMN created_by_user_id int4 NULL,
ADD COLUMN updated_by_user_id int4 NULL,
ADD COLUMN updated_at timestamptz NULL;

COMMENT ON COLUMN feature_drawn_lines.created_at IS 'Timestamp of when the line feature was created';
COMMENT ON COLUMN feature_drawn_lines.created_by_user_id IS 'User ID of the creator of the line feature';
COMMENT ON COLUMN feature_drawn_lines.updated_by_user_id IS 'User ID of the last updater of the line feature';
COMMENT ON COLUMN feature_drawn_lines.updated_at IS 'Timestamp of the last update of the line feature';

COMMENT ON COLUMN feature_drawn_points.created_at IS 'Timestamp of when the point feature was created';
COMMENT ON COLUMN feature_drawn_points.created_by_user_id IS 'User ID of the creator of the point feature';
COMMENT ON COLUMN feature_drawn_points.updated_by_user_id IS 'User ID of the last updater of the point feature';
COMMENT ON COLUMN feature_drawn_points.updated_at IS 'Timestamp of the last update of the point feature';

COMMENT ON COLUMN feature_intersections.created_at IS 'Timestamp of when the intersection feature was created';
COMMENT ON COLUMN feature_intersections.created_by_user_id IS 'User ID of the creator of the intersection feature';
COMMENT ON COLUMN feature_intersections.updated_by_user_id IS 'User ID of the last updater of the intersection feature';
COMMENT ON COLUMN feature_intersections.updated_at IS 'Timestamp of the last update of the intersection feature';

COMMENT ON COLUMN feature_signals.created_at IS 'Timestamp of when the signal feature was created';
COMMENT ON COLUMN feature_signals.created_by_user_id IS 'User ID of the creator of the signal feature';
COMMENT ON COLUMN feature_signals.updated_by_user_id IS 'User ID of the last updater of the signal feature';
COMMENT ON COLUMN feature_signals.updated_at IS 'Timestamp of the last update of the signal feature';

COMMENT ON COLUMN feature_street_segments.created_at IS 'Timestamp of when the street segment feature was created';
COMMENT ON COLUMN feature_street_segments.created_by_user_id IS 'User ID of the creator of the street segment feature';
COMMENT ON COLUMN feature_street_segments.updated_by_user_id IS 'User ID of the last updater of the street segment feature';
COMMENT ON COLUMN feature_street_segments.updated_at IS 'Timestamp of the last update of the street segment feature';





-- Altering feature_drawn_lines table
ALTER TABLE feature_drawn_lines
ADD CONSTRAINT fk_feature_drawn_lines_created_by FOREIGN KEY (created_by_user_id) REFERENCES moped_users(user_id),
ADD CONSTRAINT fk_feature_drawn_lines_updated_by FOREIGN KEY (updated_by_user_id) REFERENCES moped_users(user_id);

-- Adding comments for feature_drawn_lines constraints
COMMENT ON CONSTRAINT fk_feature_drawn_lines_created_by ON feature_drawn_lines IS 'Foreign key constraint linking created_by_user_id to moped_users table.';
COMMENT ON CONSTRAINT fk_feature_drawn_lines_updated_by ON feature_drawn_lines IS 'Foreign key constraint linking updated_by_user_id to moped_users table.';

-- Altering feature_drawn_points table
ALTER TABLE feature_drawn_points
ADD CONSTRAINT fk_feature_drawn_points_created_by FOREIGN KEY (created_by_user_id) REFERENCES moped_users(user_id),
ADD CONSTRAINT fk_feature_drawn_points_updated_by FOREIGN KEY (updated_by_user_id) REFERENCES moped_users(user_id);

-- Adding comments for feature_drawn_points constraints
COMMENT ON CONSTRAINT fk_feature_drawn_points_created_by ON feature_drawn_points IS 'Foreign key constraint linking created_by_user_id to moped_users table.';
COMMENT ON CONSTRAINT fk_feature_drawn_points_updated_by ON feature_drawn_points IS 'Foreign key constraint linking updated_by_user_id to moped_users table.';

-- Altering feature_intersections table
ALTER TABLE feature_intersections
ADD CONSTRAINT fk_feature_intersections_created_by FOREIGN KEY (created_by_user_id) REFERENCES moped_users(user_id),
ADD CONSTRAINT fk_feature_intersections_updated_by FOREIGN KEY (updated_by_user_id) REFERENCES moped_users(user_id);

-- Adding comments for feature_intersections constraints
COMMENT ON CONSTRAINT fk_feature_intersections_created_by ON feature_intersections IS 'Foreign key constraint linking created_by_user_id to moped_users table.';
COMMENT ON CONSTRAINT fk_feature_intersections_updated_by ON feature_intersections IS 'Foreign key constraint linking updated_by_user_id to moped_users table.';

-- Altering feature_signals table
ALTER TABLE feature_signals
ADD CONSTRAINT fk_feature_signals_created_by FOREIGN KEY (created_by_user_id) REFERENCES moped_users(user_id),
ADD CONSTRAINT fk_feature_signals_updated_by FOREIGN KEY (updated_by_user_id) REFERENCES moped_users(user_id);

-- Adding comments for feature_signals constraints
COMMENT ON CONSTRAINT fk_feature_signals_created_by ON feature_signals IS 'Foreign key constraint linking created_by_user_id to moped_users table.';
COMMENT ON CONSTRAINT fk_feature_signals_updated_by ON feature_signals IS 'Foreign key constraint linking updated_by_user_id to moped_users table.';

-- Altering feature_street_segments table
ALTER TABLE feature_street_segments
ADD CONSTRAINT fk_feature_street_segments_created_by FOREIGN KEY (created_by_user_id) REFERENCES moped_users(user_id),
ADD CONSTRAINT fk_feature_street_segments_updated_by FOREIGN KEY (updated_by_user_id) REFERENCES moped_users(user_id);

-- Adding comments for feature_street_segments constraints
COMMENT ON CONSTRAINT fk_feature_street_segments_created_by ON feature_street_segments IS 'Foreign key constraint linking created_by_user_id to moped_users table.';
COMMENT ON CONSTRAINT fk_feature_street_segments_updated_by ON feature_street_segments IS 'Foreign key constraint linking updated_by_user_id to moped_users table.';





-- For feature_drawn_points
DROP TRIGGER IF EXISTS set_feature_drawn_lines_updated_at ON public.feature_drawn_lines;

CREATE TRIGGER set_feature_drawn_lines_updated_at
BEFORE INSERT OR UPDATE ON feature_drawn_lines
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TRIGGER set_feature_drawn_lines_updated_at ON public.feature_drawn_lines IS 'Trigger to set updated_at timestamp for each insert or update on feature_drawn_lines';

-- For feature_drawn_points
DROP TRIGGER IF EXISTS set_feature_drawn_points_updated_at ON public.feature_drawn_points;

CREATE TRIGGER set_feature_drawn_points_updated_at
BEFORE INSERT OR UPDATE ON feature_drawn_points
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TRIGGER set_feature_drawn_points_updated_at ON public.feature_drawn_points IS 'Trigger to set updated_at timestamp for each insert or update on feature_drawn_points';

-- For feature_intersections
DROP TRIGGER IF EXISTS set_feature_intersections_updated_at ON public.feature_intersections;

CREATE TRIGGER set_feature_intersections_updated_at
BEFORE INSERT OR UPDATE ON feature_intersections
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TRIGGER set_feature_intersections_updated_at ON public.feature_intersections IS 'Trigger to set updated_at timestamp for each insert or update on feature_intersections';

-- For feature_signals
DROP TRIGGER IF EXISTS set_feature_signals_updated_at ON public.feature_signals;

CREATE TRIGGER set_feature_signals_updated_at
BEFORE INSERT OR UPDATE ON feature_signals
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TRIGGER set_feature_signals_updated_at ON public.feature_signals IS 'Trigger to set updated_at timestamp for each insert or update on feature_signals';

-- For feature_street_segments
DROP TRIGGER IF EXISTS set_feature_street_segments_updated_at ON public.feature_street_segments;

CREATE TRIGGER set_feature_street_segments_updated_at
BEFORE INSERT OR UPDATE ON feature_street_segments
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TRIGGER set_feature_street_segments_updated_at ON public.feature_street_segments IS 'Trigger to set updated_at timestamp for each insert or update on feature_street_segments';
