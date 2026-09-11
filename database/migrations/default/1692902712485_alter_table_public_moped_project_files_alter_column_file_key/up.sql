alter table "public"."moped_project_files" alter column "file_key" drop not null;

ALTER TABLE "public"."moped_project_files"
ADD CONSTRAINT file_location_not_null
CHECK (
	file_key is not null
	OR file_url is not null
);
