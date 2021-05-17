CREATE TABLE "public"."moped_proj_features_components"(
    "project_features_components_id" serial NOT NULL,
    "moped_proj_features_id" integer NOT NULL,
    "moped_proj_component_id" integer NOT NULL,
    PRIMARY KEY ("project_features_components_id"),
    FOREIGN KEY ("moped_proj_component_id")
        REFERENCES "public"."moped_proj_components"("project_component_id")
            ON UPDATE no action ON DELETE no action,
    FOREIGN KEY ("moped_proj_features_id")
        REFERENCES "public"."moped_proj_features"("feature_id")
            ON UPDATE no action ON DELETE no action
);
