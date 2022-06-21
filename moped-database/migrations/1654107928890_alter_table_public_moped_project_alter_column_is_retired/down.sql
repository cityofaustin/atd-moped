COMMENT ON COLUMN "public"."moped_project"."is_retired" IS E'';
alter table "public"."moped_project" rename column "is_deleted" to "is_retired";
