drop table feature_street_segments;
drop table feature_intersections;
drop table feature_signals;
drop table features;

alter table moped_proj_components drop column feature_layer_id_override;

alter table moped_components drop column feature_layer_id;

drop table feature_layers;