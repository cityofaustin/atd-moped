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

alter table moped_components alter column feature_layer_id set not null;

alter table moped_proj_components
  add column feature_layer_id_override integer references feature_layers(id);

create table features (
    id serial primary key, 
    name character varying
    );

create table feature_signals (
    signal_id integer default null,
    geography geography('MULTIPOINT') default null
    ) inherits (features);

create table feature_intersections (
    intersection_id integer default null,
    geography geography('MULTIPOINT') default null
    ) inherits (features);

create table feature_street_segments (
    segment_id integer default null,
    geography geography('MULTILINESTRING') default null
    ) inherits (features);

create table feature_drawn_points (
    geography geography('MULTILINESTRING') default null
    ) inherits (features);

create table feature_drawn_lines (
    geography geography('MULTILINESTRING') default null
    ) inherits (features);

