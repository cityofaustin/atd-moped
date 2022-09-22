create table projects (
  id serial primary key,
  name character varying
  );
  
-- laying down IDs so we can just insert carte blance on this DB
insert into projects (id, name) values (1, 'project_a');
insert into projects (id, name) values (2, 'project_b');
insert into projects (id, name) values (3, 'project_c');

create type representation as enum ('point', 'line');

create table component_types (
    id serial primary key,
    type character varying,
    subtype character varying,
    subcomponent character varying,
    representation representation
    );

insert into component_types (id, type, subtype, subcomponent, representation) values (1, 'Access Control', 'Driveway Closure', null, 'point');
insert into component_types (id, type, subtype, subcomponent, representation) values (2, 'Access Control', 'Driveway Gate', null, 'line');
insert into component_types (id, type, subtype, subcomponent, representation) values (3, 'Access Control', 'Driveway Modification', null, 'point');
insert into component_types (id, type, subtype, subcomponent, representation) values (4, 'Bike Box', null, null, 'line');
insert into component_types (id, type, subtype, subcomponent, representation) values (5, 'Bike Lane', 'Buffered', null, 'line');
insert into component_types (id, type, subtype, subcomponent, representation) values (6, 'Bike Lane', 'Buffered', 'Raised Pavement Markers', 'line');
insert into component_types (id, type, subtype, subcomponent, representation) values (7, 'Bike Parking', 'Corral', null, 'point');


create table components (
    id serial primary key, 
    project_id integer references projects(id),
    component_type_id integer references component_types(id),
    name character varying
    );

create table signals (
    signal_id integer default null,
    geography geography('MULTIPOINT') default null
    ) inherits (components);

create table drawn_points (
    geography geography('MULTIPOINT') default null
    ) inherits (components);

create table drawn_lines (
    geography geography('MULTILINESTRING') default null
    ) inherits (components);

-- Typeless components; these should not be alloed per policy?
insert into components (project_id, component_type_id, name) values (1, 1, 'Driveway Closure 1');
insert into components (project_id, component_type_id, name) values (1, 1, 'Driveway Closure 2');

insert into signals (project_id, component_type_id, name, signal_id, geography) values (2, 7, 'Bike Parking Corral Install', 1, ST_GeographyFromText(
    'MULTIPOINT(-97.740556 30.274722, -97.725125 30.257440, -97.760225 30.286231)'
    ));