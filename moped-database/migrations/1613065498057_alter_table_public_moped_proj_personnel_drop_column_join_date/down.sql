ALTER TABLE "public"."moped_proj_personnel" ADD COLUMN "join_date" date;
ALTER TABLE "public"."moped_proj_personnel" ALTER COLUMN "join_date" DROP NOT NULL;
