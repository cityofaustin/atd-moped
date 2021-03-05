CREATE TABLE "public"."moped_project_files"
    (
        "project_file_id" serial NOT NULL,
        "project_id" integer NOT NULL,
        "file_key" text NOT NULL,
        "file_name" text NOT NULL,
        "file_description" text NOT NULL,
        "file_size" integer NOT NULL,
        "file_permissions" jsonb,
        "file_metadata" jsonb,
        "api_response" jsonb,
        "created_by" integer NOT NULL,
        "create_date" timestamptz NOT NULL DEFAULT now(),
        "is_scanned" boolean NOT NULL DEFAULT FALSE,
        "is_retired" boolean NOT NULL DEFAULT FALSE, PRIMARY KEY ("project_file_id"),
        FOREIGN KEY ("project_id")
            REFERENCES "public"."moped_project"("project_id")
            ON UPDATE no action ON DELETE no action,
        FOREIGN KEY ("created_by")
            REFERENCES "public"."moped_users" ("user_id")
            ON UPDATE no action ON DELETE no action
    );
