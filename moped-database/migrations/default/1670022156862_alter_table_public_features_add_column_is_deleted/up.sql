alter table "public"."features" add column "is_deleted" boolean
 not null default 'false';
comment on column "public"."features"."is_deleted" is E'Indicates soft deletion';
