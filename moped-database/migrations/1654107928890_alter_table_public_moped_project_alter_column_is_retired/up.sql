COMMENT ON COLUMN "public"."moped_project"."is_retired" IS E'Indicates soft deletion';
alter table "public"."moped_project" rename column "is_retired" to "is_deleted";
