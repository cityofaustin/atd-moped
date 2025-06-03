DROP TRIGGER update_feature_signals_council_district ON feature_signals;
DROP TRIGGER update_feature_intersections_council_district ON feature_intersections;
DROP TRIGGER update_feature_drawn_points_council_district ON feature_drawn_points;
DROP TRIGGER update_feature_street_segments_council_district ON feature_street_segments;
DROP TRIGGER update_feature_drawn_lines_council_district ON feature_drawn_lines;

DROP FUNCTION public.update_council_district;

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