ALTER TABLE feature_street_segments
    ADD COLUMN length_feet INTEGER GENERATED always AS (
ST_Length(geography) * 3.28084) stored;

ALTER TABLE feature_drawn_lines
    ADD COLUMN length_feet INTEGER GENERATED always AS (
ST_Length(geography) * 3.28084) stored;
