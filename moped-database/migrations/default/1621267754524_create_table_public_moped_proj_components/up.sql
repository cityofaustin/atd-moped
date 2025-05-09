CREATE TABLE "public"."moped_proj_components"(
    "project_component_id" serial  NOT NULL,
    "project_id"           integer NOT NULL,
    "component_id"         integer NOT NULL,
    "name"                 text NOT NULL,
    "description"          text NULL,
    PRIMARY KEY ("project_component_id"),
    FOREIGN KEY ("project_id")
        REFERENCES "public"."moped_project" ("project_id")
        ON UPDATE no action ON DELETE no action,
    FOREIGN KEY ("component_id")
        REFERENCES "public"."moped_components" ("component_id")
        ON UPDATE no action ON DELETE no action
);
