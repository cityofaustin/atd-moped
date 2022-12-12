create table feature_layers (   
    id serial primary key,
    internal_table character varying not null,
    reference_layer_primary_key_column character varying
);

insert into feature_layers (internal_table, reference_layer_primary_key_column) values ('feature_drawn_points', null);
insert into feature_layers (internal_table, reference_layer_primary_key_column) values ('feature_drawn_lines', null);
-- the following entries in this table are records of outside data sources
insert into feature_layers (internal_table, reference_layer_primary_key_column) values ('feature_signals', 'signal_id');
insert into feature_layers (internal_table, reference_layer_primary_key_column) values ('feature_street_segments', 'segment_id');
insert into feature_layers (internal_table, reference_layer_primary_key_column) values ('feature_intersections', 'intersection_id');


alter table moped_components
  add column feature_layer_id integer references feature_layers(id) null;

update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Access Control' and component_subtype = 'Driveway Closure';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Access Control' and component_subtype = 'Driveway Modification';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Access Control' and component_subtype = 'Hardened Centerline';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Access Control' and component_subtype = 'Median';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Bike Lane' and component_subtype = 'Buffered';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Bike Lane' and component_subtype = 'Climbing';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Bike Lane' and component_subtype = 'Colored';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Bike Lane' and component_subtype = 'Contraflow';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Bike Lane' and component_subtype = 'Protected One-Way';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Bike Lane' and component_subtype = 'Protected Two-Way';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_signals'        ) where component_name = 'Signal' and component_subtype = 'PHB';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_signals'        ) where component_name = 'Signal' and component_subtype = 'RRFB';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_signals'        ) where component_name = 'Signal' and component_subtype = 'Traffic';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_intersections'  ) where component_name = 'Bike Box' and component_subtype is null;
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Bike Lane' and component_subtype is null;
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_intersections'  ) where component_name = 'Bike Parking' and component_subtype is null;
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_intersections'  ) where component_name = 'Bike Parking' and component_subtype = 'Corral';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Bike Lane' and component_subtype = 'Turn Lane';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Bike Lane' and component_subtype = 'Wide Curb Lane';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_intersections'  ) where component_name = 'Pavement Marking' and component_subtype = 'Crossbike';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_intersections'  ) where component_name = 'Access Control' and component_subtype = 'Driveway Gate';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_intersections'  ) where component_name = 'Dynamic Speed Display Device' and component_subtype is null;
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Guardrail' and component_subtype is null;
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_intersections'  ) where component_name = 'Highway' and component_subtype = 'Access Ramp';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Highway' and component_subtype = 'Added Capacity / Lanes';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Highway' and component_subtype = 'Collector Distributor';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Highway' and component_subtype = 'Flyover';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Highway' and component_subtype = 'Intersection Grade Separation';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Highway' and component_subtype = 'Managed Lane';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Highway' and component_subtype = 'Toll Road';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Landscaping' and component_subtype is null;
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Placemaking' and component_subtype is null;
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_intersections'  ) where component_name = 'Refuge Island' and component_subtype = 'Bike';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_intersections'  ) where component_name = 'Refuge Island' and component_subtype = 'Ped';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_intersections'  ) where component_name = 'Refuge Island' and component_subtype = 'Bike/Ped';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_intersections'  ) where component_name = 'Signal' and component_subtype = 'School Zone Beacon';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_intersections'  ) where component_name = 'Pavement Marking' and component_subtype = 'School Zone';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Sidewalk' and component_subtype is null;
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Sidewalk' and component_subtype = 'In Street';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Sidewalk' and component_subtype = 'Wide';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Sidewalk' and component_subtype = 'With Curb and Gutter';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_intersections'  ) where component_name = 'Speed Management' and component_subtype = 'Chicane';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_intersections'  ) where component_name = 'Speed Management' and component_subtype = 'Nbhd Traffic Circle';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_intersections'  ) where component_name = 'Speed Management' and component_subtype = 'Speed Cushions (Asphalt)';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_intersections'  ) where component_name = 'Speed Management' and component_subtype = 'Speed Cushions (Rubber)';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_intersections'  ) where component_name = 'Speed Management' and component_subtype = 'Speed Humps';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_intersections'  ) where component_name = 'Pavement Marking' and component_subtype = 'Stop Bar';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Transit' and component_subtype = 'Lane';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Transit' and component_subtype = 'Managed Lane Access Point';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Transit' and component_subtype = 'Transit Queue Jump';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Transit' and component_subtype = 'Transit/Bike Lane';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_intersections'  ) where component_name = 'Pavement Marking' and component_subtype = 'Two-stage Bike Turn Queue';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_intersections'  ) where component_name = 'Pavement Marking' and component_subtype = 'Sharrows';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_intersections'  ) where component_name = 'Pavement Marking' and component_subtype = 'Sharrows (Wide Curb Lane)';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_intersections'  ) where component_name = 'Signage' and component_subtype is null;
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_intersections'  ) where component_name = 'Crosswalk' and component_subtype = 'Continental';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_intersections'  ) where component_name = 'Crosswalk' and component_subtype = 'Creative';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_intersections'  ) where component_name = 'Crosswalk' and component_subtype = 'Raised';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Sidewalk' and component_subtype = 'Ramps';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Lighting' and component_subtype = 'Street lighting';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_intersections'  ) where component_name = 'Lighting' and component_subtype = 'Intersection lighting';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_intersections'  ) where component_name = 'Transit' and component_subtype = 'Bus stop';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Project Extent - Generic' and component_subtype is null;
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_intersections'  ) where component_name = 'Signage' and component_subtype = 'RRFB';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_intersections'  ) where component_name = 'Intersection' and component_subtype = 'Roundabout';

update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_street_segments') where component_name = 'Intersection' and component_subtype = 'Improvement (linear)';
update moped_components set feature_layer_id = (select id from feature_layers where internal_table = 'feature_intersections') where component_name = 'Intersection' and component_subtype = 'Improvement';

alter table moped_components alter column feature_layer_id set not null;

create table features (
    id serial primary key, 
    component_id integer references moped_proj_components(project_component_id),
    -- do we want an auto-popualted UUID here, something non-sequence based and unique for use in the mapbox library?
    name character varying -- this is an example of a "across all features" field, and we could have more of these, like above
    );

create table feature_signals (
    signal_id integer default null,
    knack_id character varying,
    project_extent_id uuid,
    location_name character varying,
    render_type character varying,
    signal_type character varying,
    source_layer character varying,
    geography geography('MULTIPOINT') default null
    ) inherits (features);

create table feature_intersections (
    intersection_id integer default null,
    project_extent_id uuid,
    source_layer character varying,
    render_type character varying,
    geography geography('MULTIPOINT') default null
    ) inherits (features);

create table feature_street_segments (
    knack_id character varying,
    ctn_segment_id integer default null,
    project_extent_id uuid,
    from_address_min integer default null,
    render_type character varying,
    to_address_max integer default null,
    full_street_name character varying,
    line_type character varying,
    symbol integer default null,
    source_layer character varying,
    geography geography('MULTILINESTRING') default null
    ) inherits (features);

create table feature_drawn_points (
    project_extent_id character varying,
    render_type character varying,
    source_layer character varying,
    geography geography('MULTIPOINT') default null
    ) inherits (features);

create table feature_drawn_lines (
    project_extent_id character varying,
    render_type character varying,
    source_layer character varying,
    geography geography('MULTILINESTRING') default null
    ) inherits (features);

create view uniform_features as (
        select id, component_id, 'feature_signals' as table, name, json_build_object(
            'signal_id', signal_id,
            'knack_id', knack_id,
            'project_extent_id', project_extent_id,
            'location_name', location_name,
            'render_type', render_type,
            'signal_type', signal_type,
            'source_layer', source_layer
            ) as attributes, geography
        FROM feature_signals
    union all
        select id, component_id, 'feature_street_segments' as table, name, json_build_object(
            'knack_id', knack_id,
            'ctn_segment_id', ctn_segment_id,
            'project_extent_id', project_extent_id,
            'from_address_min', from_address_min,
            'render_type', render_type,
            'to_address_max', to_address_max,
            'full_street_name', full_street_name,
            'line_type', line_type,
            'symbol', symbol,
            'source_layer', source_layer
            ) as attributes, geography
        FROM feature_street_segments
    union all
        select id, component_id, 'feature_intersections' as table, name, json_build_object(
            'intersection_id', intersection_id,
            'project_extent_id', project_extent_id,
            'source_layer', source_layer,
            'render_type', render_type
            ) as attributes, geography
        FROM feature_intersections
    union all
        select id, component_id, 'feature_drawn_points' as table, name, null as attributes, geography from feature_drawn_points
    union all
        select id, component_id, 'feature_drawn_lines' as table, name, null as attributes, geography from feature_drawn_lines
);

create view project_geography as (
    select 
      moped_project.project_id as project_id,
      uniform_features.id as feature_id,
      moped_components.component_id as component_archtype_id,
      moped_proj_components.project_component_id as component_id,
      moped_proj_components.is_deleted,
      moped_project.project_name as project_name,
      feature_layers.internal_table as table,
      feature_layers.reference_layer_primary_key_column as original_fk,
      moped_proj_components.name as component_name,
      uniform_features.name as feature_name,
      uniform_features.attributes as attributes,
      uniform_features.geography as geography
    from moped_project
    join moped_proj_components on (moped_proj_components.project_id = moped_project.project_id)
    join moped_components on (moped_proj_components.component_id = moped_components.component_id)
    join feature_layers on (moped_components.feature_layer_id = feature_layers.id)
    join uniform_features on (moped_proj_components.project_component_id = uniform_features.component_id)
    --join component_feature_map on (moped_proj_components.project_component_id = component_feature_map.component_id)
    --join uniform_features on (component_feature_map.feature_id = uniform_features.id)
);
