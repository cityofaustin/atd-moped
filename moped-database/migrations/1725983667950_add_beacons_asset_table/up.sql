CREATE TABLE public.feature_school_beacons (
    school_zone_beacon_id text NOT NULL,
    beacon_id text NOT NULL,
    knack_id text NOT NULL,
    location_name text NOT NULL,
    zone_name text NOT NULL,
    beacon_name text NOT NULL,
    geography geography('MULTIPOINT') NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    created_by_user_id int4 NULL,
    updated_by_user_id int4 NULL,
    updated_at timestamptz DEFAULT now()
) inherits (features);


ALTER TABLE feature_school_beacons
ADD CONSTRAINT fk_feature_school_beacons_created_by FOREIGN KEY (created_by_user_id) REFERENCES moped_users(user_id),
ADD CONSTRAINT fk_feature_school_beacons_updated_by FOREIGN KEY (updated_by_user_id) REFERENCES moped_users(user_id);

-- Adding comments for feature_school_beacons constraints
COMMENT ON CONSTRAINT fk_feature_school_beacons_created_by ON feature_school_beacons IS 'Foreign key constraint linking created_by_user_id to moped_users table.';
COMMENT ON CONSTRAINT fk_feature_school_beacons_updated_by ON feature_school_beacons IS 'Foreign key constraint linking updated_by_user_id to moped_users table.';

INSERT INTO feature_layers (id, internal_table, reference_layer_primary_key_column) values (6, 'feature_school_beacons', 'school_zone_beacon_id');
