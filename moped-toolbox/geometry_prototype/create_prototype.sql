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
    component_type character varying,
    component_subtype character varying,
    representation_type representation
    );