alter table "public"."moped_project_files" alter column "file_key" set not null;


ALTER TABLE "public"."moped_project_files"
DROP CONSTRAINT file_location_not_null;
