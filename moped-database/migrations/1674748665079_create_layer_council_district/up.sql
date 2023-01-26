CREATE TABLE layer_council_district (
    id serial PRIMARY KEY,
    council_district integer NOT NULL,
    geography geography ('POLYGON') NOT NULL
);
