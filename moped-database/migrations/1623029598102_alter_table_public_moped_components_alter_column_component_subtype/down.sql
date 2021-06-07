UPDATE moped_components
SET component_subtype = ' '
WHERE component_subtype IS NULL;

ALTER TABLE "public"."moped_components" ALTER COLUMN "component_subtype" SET NOT NULL;
