DROP TRIGGER IF EXISTS "set_public_moped_project_updated_at" ON "public"."moped_project";
ALTER TABLE "public"."moped_project" DROP COLUMN "updated_at";
