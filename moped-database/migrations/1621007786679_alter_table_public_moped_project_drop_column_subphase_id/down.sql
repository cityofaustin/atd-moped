ALTER TABLE "public"."moped_project" ADD COLUMN "subphase_id" int4;
ALTER TABLE "public"."moped_project" ALTER COLUMN "subphase_id" DROP NOT NULL;
