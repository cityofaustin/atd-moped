-- Add soft deletes to department table
ALTER TABLE moped_department ADD is_deleted boolean DEFAULT FALSE;

INSERT INTO "public"."moped_department" ("department_name", "department_abbreviation", "organization_id") VALUES
('Austin Transportation and Public Works', 'TPW', 1);
