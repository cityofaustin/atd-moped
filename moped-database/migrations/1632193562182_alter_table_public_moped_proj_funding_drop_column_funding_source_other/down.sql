ALTER TABLE "public"."moped_proj_funding" ADD COLUMN "funding_source_other" bpchar;
ALTER TABLE "public"."moped_proj_funding" ALTER COLUMN "funding_source_other" DROP NOT NULL;
