ALTER TABLE "public"."moped_project" ADD COLUMN "is_retired" boolean NOT NULL DEFAULT False;
CREATE INDEX moped_project_is_retired_index ON moped_project (is_retired);
