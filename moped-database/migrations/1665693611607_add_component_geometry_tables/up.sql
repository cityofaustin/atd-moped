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


-- todo: update rows to point to right layer in above table
