alter table "public"."moped_proj_components" rename column "date_added" to "created_at";

alter table "public"."moped_proj_components" add column "created_by_user_id" integer null;

alter table "public"."moped_proj_components" add column "updated_by_user_id" integer null;

alter table "public"."moped_proj_components" add column "updated_at" timestamptz null;

CREATE TRIGGER set_updated_at_before_insert_or_update
BEFORE INSERT OR UPDATE ON moped_proj_components
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
