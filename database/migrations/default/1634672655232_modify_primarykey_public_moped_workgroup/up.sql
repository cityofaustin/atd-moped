alter table "public"."moped_workgroup"
    add constraint "moped_workgroup_pkey" 
    primary key ( "workgroup_id" );

-- Add workgroup abbreviations

UPDATE public.moped_workgroup SET workgroup_abbreviation = 'SRTS' where workgroup_id = 20;
UPDATE public.moped_workgroup SET workgroup_abbreviation = 'CPO' where workgroup_id = 21;
UPDATE public.moped_workgroup SET workgroup_abbreviation = 'SSP' where workgroup_id = 22;


INSERT INTO "public"."moped_workgroup" (
    workgroup_id,
    workgroup_name,
    workgroup_abbreviation,
    department_id
  ) VALUES
    (1, 'Active Transportation & Street Design', 'ATSD', 1),
    (2, 'Arterial Management', 'AMD', 1),
    (3, 'Data & Technology Services', 'DTS', 1),
    (4, 'Finance', NULL, 1),
    (5, 'Human Resources', 'HR', 1),
    (6, 'Office of Special Events', 'OSE', 1),
    (7, 'Office of the Director', 'OOD', 1),
    (8, 'Parking Enterprise', 'PE', 1),
    (9, 'Parking Meters', NULL, 1),
    (10, 'Public Information Office', 'PIO', 1),
    (11, 'Right-of-Way', 'ROW', 1),
    (12, 'Signs & Markings', 'SAM', 1),
    (13, 'Smart Mobility', 'SM', 1),
    (14, 'Systems Development', 'SD', 1),
    (15, 'Transportation Engineering', 'TE', 1),
    (16, 'Transportation Development Services', 'TDS', 1),
    (17, 'Vision Zero', 'VZ', 1),
    (18, 'Other', NULL, NULL),
    (24, 'Neighborhood Partnering', NULL, 3),
    (25, 'Project Delivery', NULL, 1),
    (26, 'Shared Mobility', NULL, 1)
  ON CONFLICT ON CONSTRAINT moped_workgroup_workgroup_id_key
    DO 
      UPDATE SET workgroup_abbreviation = EXCLUDED.workgroup_abbreviation;

