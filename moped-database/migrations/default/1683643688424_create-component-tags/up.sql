CREATE TABLE "public"."moped_component_tags" (
    "id" serial,
    "name" text NOT NULL,
    "type" text NOT NULL,
    "slug" text NOT NULL,
    "is_deleted" boolean NOT NULL DEFAULT FALSE,
    PRIMARY KEY ("id"),
    UNIQUE ("name"),
    UNIQUE ("slug")
);

COMMENT ON TABLE "public"."moped_component_tags" IS 'Lookup table for component tags';

CREATE TABLE "public"."moped_proj_component_tags" (
    id SERIAL PRIMARY KEY,
    project_component_id INTEGER NOT NULL REFERENCES moped_proj_components(project_component_id) ON UPDATE CASCADE ON DELETE CASCADE,
    component_tag_id INTEGER NOT NULL REFERENCES moped_component_tags(id) ON UPDATE CASCADE ON DELETE CASCADE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

COMMENT ON TABLE "public"."moped_proj_component_tags" IS 'Tracks many tags per project component';

INSERT INTO public.moped_component_tags (name, "type", slug) values
    ('Proposed Pre-ATX Walk-bike-run','bikeways','ProposedPreATXWBR'),
    ('Proposed ATX Walk-bike-run','bikeways','ProposedATXWBR'),
    ('Council Adopted 2014','bikeways','CouncilAdopted2014'),
    ('Council Adopted 2019','bikeways','CouncilAdopted2019'),
    ('Proposed Post-ATX Walk-bike-run','bikeways','ProposedPostATXWBR'),
    ('Proposed','bikeways','Proposed'),
    ('Other Jurisdiction','bikeways','OtherJurisdiction'),
    ('Proposed ATX Walk-bike-run (tentative)','bikeways','ProposedATXWBR(tentative)');
