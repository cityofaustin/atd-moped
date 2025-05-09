ALTER TABLE "public"."moped_proj_phases" ALTER COLUMN "subphase_id" drop default;
alter table "public"."moped_proj_phases" alter column "subphase_id" drop not null;
