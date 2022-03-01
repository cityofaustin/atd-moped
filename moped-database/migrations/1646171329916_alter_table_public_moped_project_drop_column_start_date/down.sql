ALTER TABLE "public"."moped_project" ADD COLUMN "start_date" date;
ALTER TABLE "public"."moped_project" ALTER COLUMN "start_date" DROP NOT NULL;
