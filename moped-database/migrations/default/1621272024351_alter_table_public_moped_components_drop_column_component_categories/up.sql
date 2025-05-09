ALTER TABLE "public"."moped_components" DROP COLUMN "component_categories" CASCADE;
ALTER TABLE "public"."moped_components" DROP COLUMN "map_representation" CASCADE;
ALTER TABLE "public"."moped_components" ADD COLUMN "status_id" integer NULL DEFAULT 0;
