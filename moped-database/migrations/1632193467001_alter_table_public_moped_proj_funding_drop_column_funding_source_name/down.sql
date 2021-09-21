ALTER TABLE "public"."moped_proj_funding" ADD COLUMN "funding_source_name" text;
ALTER TABLE "public"."moped_proj_funding" ALTER COLUMN "funding_source_name" DROP NOT NULL;
ALTER TABLE "public"."moped_proj_funding" ADD CONSTRAINT moped_proj_fund_source_funding_source_name_fkey FOREIGN KEY (funding_source_name) REFERENCES "public"."moped_fund_sources" (funding_source_name) ON DELETE restrict ON UPDATE restrict;
