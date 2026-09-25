ALTER TABLE "public"."moped_project"
    ALTER COLUMN "project_length" DROP DEFAULT,
    ALTER COLUMN "project_length" SET DEFAULT null;

DROP FUNCTION IF EXISTS "public"."compute_project_length";
