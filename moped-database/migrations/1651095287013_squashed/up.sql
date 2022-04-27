
CREATE TABLE "public"."moped_user_followed_projects"("id" integer NOT NULL, "created_at" Timestamp NOT NULL DEFAULT now(), "project_id" Integer NOT NULL, "user_id" integer NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("user_id") REFERENCES "public"."moped_project"("project_id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("project_id") REFERENCES "public"."moped_users"("user_id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"));

alter table "public"."moped_user_followed_projects" drop constraint "moped_user_followed_projects_user_id_fkey";

alter table "public"."moped_user_followed_projects" drop constraint "moped_user_followed_projects_project_id_fkey";

ALTER TABLE "public"."moped_user_followed_projects" ADD COLUMN "id2" serial NOT NULL UNIQUE;

alter table "public"."moped_user_followed_projects" drop constraint "moped_user_followed_projects_pkey";

ALTER TABLE "public"."moped_user_followed_projects" DROP COLUMN "id" CASCADE;

alter table "public"."moped_user_followed_projects" rename column "id2" to "id";

alter table "public"."moped_user_followed_projects"
    add constraint "moped_user_followed_projects_pkey" 
    primary key ( "id" );
