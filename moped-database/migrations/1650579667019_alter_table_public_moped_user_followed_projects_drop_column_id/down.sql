ALTER TABLE "public"."moped_user_followed_projects" ADD COLUMN "id" int4;
ALTER TABLE "public"."moped_user_followed_projects" ALTER COLUMN "id" DROP NOT NULL;
