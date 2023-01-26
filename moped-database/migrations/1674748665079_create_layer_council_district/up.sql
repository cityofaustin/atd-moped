CREATE TABLE layer_council_district (
    id serial PRIMARY KEY,
    council_district integer UNIQUE NOT NULL,
    geography geography ('MULTIPOLYGON') NOT NULL
);
