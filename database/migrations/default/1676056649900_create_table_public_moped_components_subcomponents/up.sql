CREATE TABLE public.moped_components_subcomponents (
    "id" serial NOT NULL,
    "component_id" integer NOT NULL,
    "subcomponent_id" integer NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("component_id") REFERENCES "public"."moped_components" ("component_id") ON UPDATE restrict ON DELETE restrict,
    FOREIGN KEY ("subcomponent_id") REFERENCES "public"."moped_subcomponents" ("subcomponent_id") ON UPDATE restrict ON DELETE restrict
);

COMMENT ON TABLE "public"."moped_components_subcomponents" IS E'tracks allowed subcomponents by component type';
