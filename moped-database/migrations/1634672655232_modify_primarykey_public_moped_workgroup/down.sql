alter table "public"."moped_workgroup" drop constraint "moped_workgroup_pkey";

-- Restore workgroup abbreviations
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = NULL where workgroup_id = 1
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = NULL where workgroup_id = 2
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = NULL where workgroup_id = 3
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = NULL where workgroup_id = 5
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = NULL where workgroup_id = 6
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = NULL where workgroup_id = 7
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = NULL where workgroup_id = 8
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = NULL where workgroup_id = 10
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = NULL where workgroup_id = 11
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = NULL where workgroup_id = 12
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = NULL where workgroup_id = 13
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = NULL where workgroup_id = 14
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = NULL where workgroup_id = 15
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = NULL where workgroup_id = 16
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = NULL where workgroup_id = 17
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = NULL where workgroup_id = 20
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = NULL where workgroup_id = 21
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = NULL where workgroup_id = 22

DELETE FROM public.moped_workgroup WHERE workgroup_id > 23