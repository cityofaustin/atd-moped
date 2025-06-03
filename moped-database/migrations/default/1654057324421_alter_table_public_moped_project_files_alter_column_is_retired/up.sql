COMMENT ON COLUMN "public"."moped_project_files"."is_retired" IS E'Indicates soft deletion';
alter table "public"."moped_project_files" rename column "is_retired" to "is_deleted";
