CREATE TABLE "public"."moped_file_types" ("id" serial NOT NULL, "name" text NOT NULL UNIQUE, "slug" text NOT NULL UNIQUE, PRIMARY KEY ("id"));

COMMENT ON TABLE "public"."moped_file_types" IS 'lookup table of file types';
INSERT INTO moped_file_types (id, name, slug) VALUES
(1, 'Funding', 'funding'),
(2, 'Plans', 'plans'),
(3, 'Estimates', 'estimates'),
(4, 'Other', 'other');

ALTER TABLE "public"."moped_project_files"
ADD CONSTRAINT moped_project_files_type_fkey FOREIGN KEY ("file_type")
REFERENCES moped_file_types ("id");
