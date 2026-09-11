alter table "public"."moped_workgroup" drop constraint "moped_workgroup_pkey";

-- Restore workgroup abbreviations
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = NULL where workgroup_id = 20;
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = NULL where workgroup_id = 21;
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = NULL where workgroup_id = 22;

DELETE FROM public.moped_workgroup WHERE workgroup_id > 23;

-- records with workgroup ids 19, 20, 21, 22 added/removed in previous migrations
DELETE FROM public.moped_workgroup WHERE workgroup_id < 19;
