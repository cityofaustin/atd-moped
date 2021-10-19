alter table "public"."moped_workgroup"
    add constraint "moped_workgroup_pkey" 
    primary key ( "workgroup_id" );

-- Add workgroup abbreviations

UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = 'ATSD' where workgroup_id = 1
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = 'AMD' where workgroup_id = 2
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = 'DTS' where workgroup_id = 3
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = 'HR' where workgroup_id = 5
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = 'OSE' where workgroup_id = 6
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = 'OOD' where workgroup_id = 7
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = 'PE' where workgroup_id = 8
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = 'PIO' where workgroup_id = 10
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = 'ROW' where workgroup_id = 11
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = 'SAM' where workgroup_id = 12
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = 'SM' where workgroup_id = 13
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = 'SD' where workgroup_id = 14
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = 'TE' where workgroup_id = 15
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = 'TDS' where workgroup_id = 16
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = 'VZ' where workgroup_id = 17
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = 'SRTS' where workgroup_id = 20
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = 'CPO' where workgroup_id = 21
UPDATE "public"."moped_workgroup" SET workgroup_abbreviation = 'SSP' where workgroup_id = 22

INSERT INTO "public"."moped_workgroup" (workgroup_id, workgroup_name, workgroup_abbreviation, department_id)
  VALUES 
  (24, 'Neighborhood Planning', NULL, 3), 
  (25, 'Project Delivery', NULL, 1),
  (26, 'Shared Mobility', NULL, 1),

