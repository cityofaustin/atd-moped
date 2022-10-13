create table feature_layers (   
    id serial primary key,
    internal_table character varying not null, -- I want to call this "table" but that's a very reserved word. Any other ideas? 
    reference_layer_primary_key_column character varying
);

insert into feature_layers (internal_table, reference_layer_primary_key_column) values ('drawn_points', null);
insert into feature_layers (internal_table, reference_layer_primary_key_column) values ('drawn_lines', null);
-- the following entries in this table are records of outside data sources
insert into feature_layers (internal_table, reference_layer_primary_key_column) values ('signals', 'signal_id');
insert into feature_layers (internal_table, reference_layer_primary_key_column) values ('segments', 'segment_id');
insert into feature_layers (internal_table, reference_layer_primary_key_column) values ('intersections', 'intersection_id');

