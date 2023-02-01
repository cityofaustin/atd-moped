alter table "public"."moped_proj_notes" add column "added_by" text;
comment on column "public"."moped_proj_notes"."added_by" is E'moped_project_notes';
