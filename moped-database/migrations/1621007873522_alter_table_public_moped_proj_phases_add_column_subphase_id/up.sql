ALTER TABLE "public"."moped_proj_phases" ADD COLUMN "subphase_name" text;
ALTER TABLE "public"."moped_proj_phases" ADD COLUMN "subphase_id" integer NOT NULL DEFAULT 0;
