CREATE TABLE "public"."moped_proj_features_components"(
    "project_features_components_id" serial NOT NULL,
    "moped_proj_features_id" integer NOT NULL,
    "moped_proj_component_id" integer NOT NULL,
    "name" text NULL,
    "description" text NULL,
    "create_date" timestamp default now(),
    "status_id" integer NOT NULL default 0,
    PRIMARY KEY ("project_features_components_id"),
    FOREIGN KEY ("moped_proj_component_id")
        REFERENCES "public"."moped_proj_components"("project_component_id")
            ON UPDATE no action ON DELETE no action,
    FOREIGN KEY ("moped_proj_features_id")
        REFERENCES "public"."moped_proj_features"("feature_id")
            ON UPDATE no action ON DELETE no action
);


CREATE INDEX moped_proj_features_components_moped_proj_component_id_index
	ON moped_proj_features_components (moped_proj_component_id);

CREATE INDEX moped_proj_features_components_moped_proj_features_id_index
	ON moped_proj_features_components (moped_proj_features_id);
