
alter table "public"."moped_user_followed_projects" drop constraint "moped_user_followed_projects_pkey";

alter table "public"."moped_user_followed_projects" rename column "id" to "id2";

ALTER TABLE "public"."moped_user_followed_projects" ADD COLUMN "id" int4;
ALTER TABLE "public"."moped_user_followed_projects" ALTER COLUMN "id" DROP NOT NULL;

alter table "public"."moped_user_followed_projects"
    add constraint "moped_user_followed_projects_pkey" 
    primary key ( "id" );

ALTER TABLE "public"."moped_user_followed_projects" DROP COLUMN "id2";

alter table "public"."moped_user_followed_projects" add foreign key ("project_id") references "public"."moped_users"("user_id") on update restrict on delete restrict;

alter table "public"."moped_user_followed_projects" add foreign key ("user_id") references "public"."moped_project"("project_id") on update restrict on delete restrict;

DROP TABLE "public"."moped_user_followed_projects";
