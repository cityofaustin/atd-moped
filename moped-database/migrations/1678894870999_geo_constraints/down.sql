alter table "public"."features" alter column "component_id" drop not null;
alter table "public"."feature_signals" alter column "component_id" drop not null;
alter table "public"."feature_signals" alter column "knack_id" drop not null;
alter table "public"."feature_signals" alter column "geography" drop not null;
alter table "public"."feature_signals" alter column "geography" set default NULL::geography;
alter table "public"."feature_signals" alter column "signal_type" drop not null;
alter table "public"."feature_signals" alter column "location_name" drop not null;
alter table "public"."feature_signals" alter column "signal_id" drop not null;
