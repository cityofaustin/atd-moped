CREATE TABLE "public"."moped_user_followed_projects" (
    "id" serial primary key,
    "project_id" integer not null,
    "user_id" integer not null,
    "created_at" timestamp default now()
    );
