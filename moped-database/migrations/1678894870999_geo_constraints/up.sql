alter table "public"."feature_signals" alter column "signal_id" set not null;
alter table "public"."feature_signals" alter column "location_name" set not null;
alter table "public"."feature_signals" alter column "signal_type" set not null;
ALTER TABLE "public"."feature_signals" ALTER COLUMN "geography" drop default;
alter table "public"."feature_signals" alter column "geography" set not null;
alter table "public"."feature_signals" alter column "knack_id" set not null;
alter table "public"."feature_signals" alter column "component_id" set not null;
alter table "public"."features" alter column "component_id" set not null;
