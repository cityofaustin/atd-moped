COMMENT ON COLUMN "public"."moped_project_files"."is_retired" IS E'';
alter table "public"."moped_project_files" rename column "is_deleted" to "is_retired";
