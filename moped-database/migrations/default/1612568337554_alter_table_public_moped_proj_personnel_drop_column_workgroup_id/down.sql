ALTER TABLE "public"."moped_proj_personnel" ADD COLUMN "workgroup_id" int4;
ALTER TABLE "public"."moped_proj_personnel" ALTER COLUMN "workgroup_id" DROP NOT NULL;
