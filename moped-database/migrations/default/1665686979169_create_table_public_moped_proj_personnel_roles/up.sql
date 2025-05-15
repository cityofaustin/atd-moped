CREATE TABLE "public"."moped_proj_personnel_roles" (
    "id" serial NOT NULL,
    "project_personnel_id" INTEGER NOT NULL,
    "project_role_id" INTEGER NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("project_personnel_id") REFERENCES "public"."moped_proj_personnel" ("project_personnel_id") 
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY ("project_role_id") REFERENCES "public"."moped_project_roles" ("project_role_id") 
    ON UPDATE CASCADE ON DELETE SET NULL
);

COMMENT ON TABLE "public"."moped_proj_personnel_roles" IS
    E'Tracks project roles associated with project personnel, aka team members';
