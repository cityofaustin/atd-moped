ALTER TABLE "public"."moped_proj_personnel" ADD COLUMN "role_name" text;
ALTER TABLE "public"."moped_proj_personnel" ALTER COLUMN "role_name" DROP NOT NULL;
ALTER TABLE "public"."moped_proj_personnel" ADD CONSTRAINT moped_proj_personnel_role_name_fk FOREIGN KEY (role_name) REFERENCES "public"."moped_project_roles" (project_role_name) ON DELETE no action ON UPDATE no action;
