ALTER TABLE moped_project_files DROP CONSTRAINT "moped_project_files_created_by_fkey";

ALTER TABLE moped_project_files ADD CONSTRAINT "moped_project_files_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."moped_users"("user_id");
