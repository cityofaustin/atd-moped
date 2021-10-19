ALTER TABLE "public"."moped_department" ADD COLUMN "organization_id" integer NULL;

INSERT INTO public.moped_department (department_id, department_name, organization_id, department_abbreviation)
  VALUES 
  (5, 'Housing & Planning', 1, NULL), 
  (6, 'Aviation', 1, NULL),
  (7, 'Economic Development', 1, NULL),
  (8, 'Parks & Recreation', 1, NULL),
  (9, 'Watershed', 1, NULL),
  (10, 'Development Services', 1, 'DSD')
