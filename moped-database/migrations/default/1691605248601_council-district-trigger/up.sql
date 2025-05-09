-- add spatial index to this layer
CREATE INDEX layer_council_district_geom_idx
  ON layer_council_district
  USING GIST (geography);

-- create table to hold feature-district associations
CREATE TABLE public.features_council_districts (
    id serial PRIMARY KEY,
    feature_id integer NOT NULL,
    council_district_id integer NOT NULL,
    FOREIGN KEY ("council_district_id") REFERENCES "public"."layer_council_district" ("council_district")
        ON UPDATE CASCADE ON DELETE CASCADE
);

ALTER TABLE public.features_council_districts
    ADD CONSTRAINT unique_feature_council_district UNIQUE ("feature_id", "council_district_id");

CREATE INDEX features_council_district_feature_id_idx ON features_council_districts (feature_id);
CREATE INDEX features_council_district_council_district_id_idx ON features_council_districts (council_district_id);

-- create functions to mange point and line type associations
CREATE OR REPLACE FUNCTION public.update_line_council_district()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- currently the moped editor never updates a geometry, it marks a feature as is_deleted
    -- and inserts a new feature. so we should only ever see a geometry update from some
    -- ad-hoc developer intervention
    IF TG_OP = 'UPDATE' AND ST_Equals(NEW.geography::geometry, OLD.geography::geometry) THEN
        -- nothing to do
        RETURN NEW;
    END IF;
    -- delete previous district associations
    -- again, because the moped editor only inserts new geometries, there will typically
    -- not be any old feature-district associations to delete
    DELETE FROM features_council_districts WHERE feature_id = NEW.id;
    -- insert new district associations
    WITH inserts_todo AS (
        SELECT
            NEW.id AS feature_id,
            districts.council_district AS council_district_id
        FROM
            layer_council_district AS districts
        WHERE
            ST_Intersects(districts.geography, NEW.geography)
        OR
            ST_Crosses(districts.geography::geometry, NEW.geography::geometry)
    )
        INSERT INTO features_council_districts (feature_id, council_district_id)
            SELECT * FROM inserts_todo;
    RETURN NEW;
    END;
$$;

CREATE OR REPLACE FUNCTION public.update_point_council_district()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- currently the moped editor never updates a geometry, it marks a feature as is_deleted
    -- and inserts a new feature. so we should only ever see a geometry update from some
    -- ad-hoc developer intervention
    IF TG_OP = 'UPDATE' AND ST_Equals(NEW.geography::geometry, OLD.geography::geometry) THEN
        -- nothing to do
        RETURN NEW;
    END IF;
    -- delete previous district associations
    -- again, because the moped editor only inserts new geometries, there will be typically
    -- not be any old feature-district associations to delete
    DELETE FROM features_council_districts WHERE feature_id = NEW.id;
    -- insert new district associations
    WITH inserts_todo AS (
        SELECT
            NEW.id AS feature_id,
            districts.council_district AS council_district_id
        FROM
            layer_council_district AS districts
        WHERE
            ST_Intersects(districts.geography,
                NEW.geography)
    ) INSERT INTO features_council_districts (feature_id, council_district_id)
    SELECT
        *
    FROM
        inserts_todo;
    RETURN NEW;
    END;
$$;

-- create triggers on all feature layers
CREATE TRIGGER update_feature_signals_council_district BEFORE INSERT OR UPDATE ON feature_signals
    FOR EACH ROW EXECUTE FUNCTION update_point_council_district();

CREATE TRIGGER update_feature_intersections_council_district BEFORE INSERT OR UPDATE ON feature_intersections
    FOR EACH ROW EXECUTE FUNCTION update_point_council_district();

CREATE TRIGGER update_feature_drawn_points_council_district BEFORE INSERT OR UPDATE ON feature_drawn_points
    FOR EACH ROW EXECUTE FUNCTION update_point_council_district();

CREATE TRIGGER update_feature_street_segments_council_district BEFORE INSERT OR UPDATE ON feature_street_segments
    FOR EACH ROW EXECUTE FUNCTION update_line_council_district();

CREATE TRIGGER update_feature_drawn_lines_council_district BEFORE INSERT OR UPDATE ON feature_drawn_lines
    FOR EACH ROW EXECUTE FUNCTION update_line_council_district();

-- Run a one-time batch update to add districts to all features in the DB
WITH point_features_union AS (
    SELECT
        id,
        geography
    FROM
        feature_signals
    UNION ALL
    SELECT
        id,
        geography
    FROM
        feature_intersections
    UNION ALL
    SELECT
        id,
        geography
    FROM
        feature_drawn_points
) insert into features_council_districts (feature_id, council_district_id)
    (SELECT
    point_features_union.id AS feature_id,
    districts.council_district AS council_district_id
FROM
    point_features_union
    LEFT JOIN layer_council_district AS districts ON ST_Intersects(districts.geography, point_features_union.geography)
    WHERE districts.council_district IS NOT NULL);


WITH line_features_union AS (
    SELECT
        id,
        geography
    FROM
        feature_street_segments
    UNION ALL
    SELECT
        id,
        geography
    FROM
        feature_drawn_lines
) insert into features_council_districts (feature_id, council_district_id)
    (SELECT
    line_features_union.id AS feature_id,
    districts.council_district AS council_district_id
FROM
    line_features_union
    LEFT JOIN layer_council_district AS districts ON
        ST_Intersects(districts.geography, line_features_union.geography)
    OR  ST_Crosses(districts.geography::geometry, line_features_union.geography::geometry)
    WHERE districts.council_district IS NOT NULL);
