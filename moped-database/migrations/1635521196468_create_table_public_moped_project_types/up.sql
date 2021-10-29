CREATE TABLE "public"."moped_project_types"("project_id" integer NOT NULL, "type_name" text NOT NULL, "project_type_id" integer NOT NULL, "date_added" timestamptz DEFAULT clock_timestamp(), "added_by" integer, PRIMARY KEY ("project_type_id") , FOREIGN KEY ("type_name") REFERENCES "public"."moped_types"("type_name") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("project_id") REFERENCES "public"."moped_project"("project_id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("project_type_id"));
