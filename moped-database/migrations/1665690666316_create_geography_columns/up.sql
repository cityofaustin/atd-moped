alter table moped_proj_features 
    add column geography_collection geography(GEOMETRYCOLLECTION, 4326),
    add column geography_point geography(POINT, 4326),
    add column geography_linestring geography(LINESTRING, 4326),
    add column attributes jsonb;