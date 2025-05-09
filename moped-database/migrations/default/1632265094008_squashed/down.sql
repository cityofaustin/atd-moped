
alter table "public"."moped_proj_funding" drop constraint "moped_proj_funding_funding_status_id_fkey";

alter table "public"."moped_proj_funding" drop constraint "moped_proj_funding_funding_program_id_fkey";

DROP TABLE "public"."moped_fund_status";

alter table "public"."moped_fund_programs" rename column "funding_program_name" to "funding_source_category_name";

alter table "public"."moped_fund_programs" rename column "funding_program_id" to "funding_source_category_id";

alter table "public"."moped_fund_programs" rename to "moped_fund_source_cat";

alter table "public"."moped_fund_sources" add foreign key ("funding_source_category") references "public"."moped_fund_source_cat"("funding_source_category_name") on update restrict on delete restrict;

alter table "public"."moped_proj_funding" drop constraint "moped_proj_funding_funding_source_id_fkey";

ALTER TABLE "public"."moped_proj_funding" ADD COLUMN "funding_source_other" bpchar;
ALTER TABLE "public"."moped_proj_funding" ALTER COLUMN "funding_source_other" DROP NOT NULL;

ALTER TABLE "public"."moped_proj_funding" ADD COLUMN "funding_source_category" text;
ALTER TABLE "public"."moped_proj_funding" ALTER COLUMN "funding_source_category" DROP NOT NULL;
ALTER TABLE "public"."moped_proj_funding" ADD CONSTRAINT moped_proj_fund_source_funding_source_category_fkey FOREIGN KEY (funding_source_category) REFERENCES "public"."moped_fund_source_cat" (funding_source_category_name) ON DELETE restrict ON UPDATE restrict;

ALTER TABLE "public"."moped_proj_funding" ADD COLUMN "funding_source_name" text;
ALTER TABLE "public"."moped_proj_funding" ALTER COLUMN "funding_source_name" DROP NOT NULL;
ALTER TABLE "public"."moped_proj_funding" ADD CONSTRAINT moped_proj_fund_source_funding_source_name_fkey FOREIGN KEY (funding_source_name) REFERENCES "public"."moped_fund_sources" (funding_source_name) ON DELETE restrict ON UPDATE restrict;

ALTER TABLE "public"."moped_proj_funding" DROP COLUMN "funding_status_id";

ALTER TABLE "public"."moped_proj_funding" DROP COLUMN "funding_description";

ALTER TABLE "public"."moped_proj_funding" DROP COLUMN "fund_dept_unit";

ALTER TABLE "public"."moped_proj_funding" DROP COLUMN "funding_amount";

ALTER TABLE "public"."moped_proj_funding" DROP COLUMN "funding_program_id";

ALTER TABLE "public"."moped_proj_funding" DROP COLUMN "funding_source_id";

alter table "public"."moped_proj_funding" rename column "proj_funding_id" to "proj_fund_source_id";

alter table "public"."moped_proj_funding" rename to "moped_proj_fund_source";
