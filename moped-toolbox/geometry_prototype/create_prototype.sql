create table projects (
  id serial primary key,
  name character varying
  );
  
-- laying down IDs so we can just insert carte blance on this DB
insert into projects (id, name) values (1, 'project_a');
insert into projects (id, name) values (2, 'project_b');
insert into projects (id, name) values (3, 'project_c');

--create type representation as enum ('point', 'line');

create type component_type as enum ('signals', 'drawn_points', 'drawn_lines');
create table component_types (
    id serial primary key,
    type character varying,
    subtype character varying,
    subcomponent character varying,
    component_type component_type
    );

insert into component_types (id, type, subtype, subcomponent, component_type) values (1, 'Access Control', 'Driveway Closure', null, 'drawn_points');
insert into component_types (id, type, subtype, subcomponent, component_type) values (2, 'Access Control', 'Driveway Gate', null, 'drawn_lines');
insert into component_types (id, type, subtype, subcomponent, component_type) values (3, 'Access Control', 'Driveway Modification', null, 'drawn_points');
insert into component_types (id, type, subtype, subcomponent, component_type) values (4, 'Bike Box', null, null, 'drawn_lines');
insert into component_types (id, type, subtype, subcomponent, component_type) values (5, 'Bike Lane', 'Buffered', null, 'drawn_lines');
insert into component_types (id, type, subtype, subcomponent, component_type) values (6, 'Bike Lane', 'Buffered', 'Raised Pavement Markers', 'drawn_lines');
insert into component_types (id, type, subtype, subcomponent, component_type) values (7, 'Bike Parking', 'Corral', null, 'drawn_points');
insert into component_types (id, type, subtype, subcomponent, component_type) values (8, 'Signal', 'PHB', null, 'signals');
insert into component_types (id, type, subtype, subcomponent, component_type) values (9, 'Signal', 'PHB', 'Audible Push Button', 'signals');
insert into component_types (id, type, subtype, subcomponent, component_type) values (10, 'Signal', 'Traffic', null, 'signals');

create table components (
    id serial primary key, 
    project_id integer references projects(id),
    component_type_id integer references component_types(id),
    name character varying
    );

create table features (
    id serial primary key, 
    name character varying
    );

create table signals (
    signal_id integer default null,
    geography geography('MULTIPOINT') default null
    ) inherits (features);

create table drawn_points (
    geography geography('MULTIPOINT') default null
    ) inherits (features);

create table drawn_lines (
    geography geography('MULTILINESTRING') default null
    ) inherits (features);

-- Typeless components; these should not be allowed per policy?
insert into features (name) values ('Driveway Closure 1');
insert into features (name) values ('Driveway Closure 2');

insert into signals (name, signal_id, geography) values ('A new set of PHBs', 1001, ST_GeographyFromText(
    'MULTIPOINT(-97.740556 30.274722, -97.725125 30.257440, -97.760225 30.286231)'
    ));





create table component_feature_map (
    id serial primary key,
    component_id integer references components(id),
    feature_id integer references features(id)
    );

