ALTER TABLE "public"."moped_proj_personnel" ADD COLUMN "role_order" int4;
ALTER TABLE "public"."moped_proj_personnel" ALTER COLUMN "role_order" DROP NOT NULL;
