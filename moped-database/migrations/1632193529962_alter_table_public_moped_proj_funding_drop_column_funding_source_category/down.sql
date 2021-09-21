ALTER TABLE "public"."moped_proj_funding" ADD COLUMN "funding_source_category" text;
ALTER TABLE "public"."moped_proj_funding" ALTER COLUMN "funding_source_category" DROP NOT NULL;
ALTER TABLE "public"."moped_proj_funding" ADD CONSTRAINT moped_proj_fund_source_funding_source_category_fkey FOREIGN KEY (funding_source_category) REFERENCES "public"."moped_fund_source_cat" (funding_source_category_name) ON DELETE restrict ON UPDATE restrict;
