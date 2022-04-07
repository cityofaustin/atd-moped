-- Remove default calculation for project_length and set default to null
ALTER TABLE "public"."moped_project"
    ALTER COLUMN "project_length" DROP DEFAULT;
    ALTER COLUMN "project_length" SET DEFAULT null;

-- Drop function for calculating project length
DROP FUNCTION IF EXISTS "public"."compute_project_length";