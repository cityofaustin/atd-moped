ALTER TABLE "public"."moped_proj_personnel" ADD COLUMN "allocation" int4;
ALTER TABLE "public"."moped_proj_personnel" ALTER COLUMN "allocation" DROP NOT NULL;
