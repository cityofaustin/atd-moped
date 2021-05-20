ALTER TABLE "public"."moped_components" ADD COLUMN "component_categories" text;
ALTER TABLE "public"."moped_components" ALTER COLUMN "component_categories" DROP NOT NULL;
ALTER TABLE "public"."moped_components" ADD COLUMN "map_representation" text;
ALTER TABLE "public"."moped_components" ALTER COLUMN "map_representation" DROP NOT NULL;
ALTER TABLE "public"."moped_components" DROP COLUMN "status_id";
