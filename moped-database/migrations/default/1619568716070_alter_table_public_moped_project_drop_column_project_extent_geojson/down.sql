ALTER TABLE "public"."moped_project" ADD COLUMN "project_extent_geojson" jsonb;
ALTER TABLE "public"."moped_project" ALTER COLUMN "project_extent_geojson" DROP NOT NULL;
