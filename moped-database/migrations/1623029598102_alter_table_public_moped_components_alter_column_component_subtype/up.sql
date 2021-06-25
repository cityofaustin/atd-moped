ALTER TABLE "public"."moped_components" ALTER COLUMN "component_subtype" DROP NOT NULL;

UPDATE moped_components
 SET component_subtype = NULL
 WHERE component_subtype = ' ';
