-- drop all new columns (this will also drop constraints)
alter table "public"."moped_proj_components" drop column "phase_id";
alter table "public"."moped_proj_components" drop column "subphase_id";
alter table "public"."moped_proj_components" drop column "phase_end";
alter table "public"."moped_proj_components" drop column "date_added";
