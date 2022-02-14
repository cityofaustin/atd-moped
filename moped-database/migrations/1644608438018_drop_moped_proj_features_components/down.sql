create table moped_proj_features_components
(
    project_features_components_id integer   default nextval('moped_proj_features_component_project_features_components_i_seq'::regclass) not null
        primary key,
    moped_proj_features_id         integer                                                                                                not null
        references moped_proj_features,
    moped_proj_component_id        integer                                                                                                not null
        references moped_proj_components
            on update cascade on delete cascade,
    name                           text,
    description                    text,
    create_date                    timestamp default now(),
    status_id                      integer   default 0                                                                                    not null
);

create index moped_proj_features_components_moped_proj_component_id_index
    on moped_proj_features_components (moped_proj_component_id);

create index moped_proj_features_components_moped_proj_features_id_index
    on moped_proj_features_components (moped_proj_features_id);

