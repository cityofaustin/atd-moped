alter table "public"."moped_proj_components" add column "srts_id" text
 null;

COMMENT ON COLUMN moped_proj_components.srts_id IS 'The Safe Routes to School infrastructure plan record identifier';
