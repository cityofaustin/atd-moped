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
