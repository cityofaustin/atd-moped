create table projects (
  id serial primary key,
  name character varying
  );
  
-- laying down IDs so we can just insert carte blanche on this DB
insert into projects (id, name) values (1, 'project_a');
insert into projects (id, name) values (2, 'project_b');
insert into projects (id, name) values (3, 'project_c');

--create type representation as enum ('point', 'line');

create table layers (   
    id serial primary key,
    internal_table character varying, -- I want to call this "table" but that's a very reserved word. Any other ideas? 
    reference_layer_primary_key_column character varying
);


insert into layers (id, internal_table, reference_layer_primary_key_column) values (1, 'drawn_points', null);
insert into layers (id, internal_table, reference_layer_primary_key_column) values (2, 'drawn_lines', null);
-- the following entries in this table are records of outside data sources
insert into layers (id, internal_table, reference_layer_primary_key_column) values (3, 'signals', 'signal_id');
insert into layers (id, internal_table, reference_layer_primary_key_column) values (4, 'segments', 'segment_id');
insert into layers (id, internal_table, reference_layer_primary_key_column) values (5, 'intersections', 'intersection_id');

create table component_types (
    id serial primary key,
    component_type character varying,
    subtype character varying,
    subcomponent character varying,
    layer_id integer references layers(id) -- think of this layer as the default source layer that users pick geometr from
    );

-- These are the valid choices of component_types that can be added.
-- Component_type, subtype, and subcomponent are canidates for breaking out into their own tables.
insert into component_types (id, component_type, subtype, subcomponent, layer_id) values (1, 'Signal', 'PHB', null, 3);
insert into component_types (id, component_type, subtype, subcomponent, layer_id) values (2, 'Signal', 'PHB', 'Audible Push Button', 3);
insert into component_types (id, component_type, subtype, subcomponent, layer_id) values (3, 'Signal', 'Traffic', null, 3);
insert into component_types (id, component_type, subtype, subcomponent, layer_id) values (4, 'Sidewalk Install', 'Concrete', null, 4);
insert into component_types (id, component_type, subtype, subcomponent, layer_id) values (5, 'Intersection Markings', null, null, 5);

create table components (
    id serial primary key, 
    project_id integer references projects(id),
    component_type_id integer references component_types(id),
    layer_id_override integer references layers(id) default null, -- think of this layer, which is optional, as an override of the default source, and most likly will always be a pointer to 'drawn_points' or 'drawn_lines'
    name character varying
    );

insert into components (id, project_id, component_type_id, name) values (1, 1, 1, 'A component (signal-phb) for project (project_a).');
insert into components (id, project_id, component_type_id, layer_id_override, name) values (2, 1, 1, 2, 'A sidewalk for project (project_a). Hand drawn.');

-- feature type generic fields related to the geometry could be put here, plus i really like the global ID space it enforces over feature geometry subtables
create table features (
    id serial primary key, 
    name character varying
    );

-- should we prefix these tables with something to logically group them? schema them?
create table signals (
    signal_id integer default null,
    geography geography('MULTIPOINT') default null
    ) inherits (features);


insert into signals (id, name, signal_id, geography) values (1, 'A new set of PHBs', 1001, ST_GeographyFromText(
    'MULTIPOINT(-97.740556 30.274722, -97.725125 30.257440, -97.760225 30.286231)'
    ));

create table sidewalks (
    sidewalk_id integer default null,
    sidewalk_name character varying default null,
    geography geography('MULTILINESTRING') default null
    ) inherits (features);

insert into sidewalks (id, name, sidewalk_id, sidewalk_name, geography) values (2, 'A fancy new sidewalk', 4242, 'This is a sidewalk attribute: name', ST_GeographyFromText(
    'MULTILINESTRING((-97.740556 30.274722, -97.725125 30.257440, -97.760225 30.286231))'
    ));

create table drawn_points (
    geography geography('MULTIPOINT') default null
    ) inherits (features);

create table drawn_lines (
    geography geography('MULTILINESTRING') default null
    ) inherits (features);

create view uniform_features as (
        select id, 'signals' as table, name, json_build_object('signal_id', signal_id) as attributes, geography
        FROM signals
    union all
        select id, 'sidewalks' as table, name, json_build_object('sidewalk_id', sidewalk_id, 'sidewalk_name', sidewalk_name) as attributes, geography
        FROM sidewalks
    union all
        select id, 'drawn_points' as table, name, null as attributes, geography from drawn_points
    union all
        select id, 'drawn_lines' as table, name, null as attributes, geography from drawn_lines
);

create table component_feature_map (
    id serial primary key,
    component_id integer references components(id),
    feature_id integer default null
    );

insert into component_feature_map (id, component_id, feature_id) values (1, 1, 1);
insert into component_feature_map (id, component_id, feature_id) values (2, 2, 2);

create view project_geography as (
    select projects.id as project_id,
    uniform_features.id as feature_id,
    components.id as component_id,
    projects.name as project_name,
    component_types."type" as component_type,
    components.name as component_name,
    uniform_features.name as feature_name,
    uniform_features.attributes as attribute_name,
    uniform_features.geography as geography
    from projects
    join components on (components.project_id = projects.id)
    join component_types on (components.component_type_id = component_types.id)
    join component_feature_map on (components.id = component_feature_map.component_id)
    join uniform_features on (component_feature_map.feature_id = uniform_features.id)
);