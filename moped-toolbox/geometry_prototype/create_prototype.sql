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

-- FIXME: model this more closely on existing moped, because subcomponent & maybe subtype may be in tables to power the drop and options to not pick an option
insert into component_types (id, type, subtype, subcomponent, representation) values (1, 'Access Control', 'Driveway Closure', null, 'point');
insert into component_types (id, type, subtype, subcomponent, representation) values (2, 'Access Control', 'Driveway Gate', null, 'line');
insert into component_types (id, type, subtype, subcomponent, representation) values (3, 'Access Control', 'Driveway Modification', null, 'point');
insert into component_types (id, type, subtype, subcomponent, representation) values (4, 'Bike Box', null, null, 'line');
insert into component_types (id, type, subtype, subcomponent, representation) values (5, 'Bike Lane', 'Buffered', null, 'line');
insert into component_types (id, type, subtype, subcomponent, representation) values (6, 'Bike Lane', 'Buffered', 'Raised Pavement Markers', 'line');
insert into component_types (id, type, subtype, subcomponent, representation) values (7, 'Bike Parking', 'Corral', null, 'point');