
alter table "public"."moped_proj_fund_source" rename to "moped_proj_funding";

alter table "public"."moped_proj_funding" rename column "proj_fund_source_id" to "proj_funding_id";

ALTER TABLE "public"."moped_proj_funding" ADD COLUMN "funding_source_id" integer NULL;

ALTER TABLE "public"."moped_proj_funding" ADD COLUMN "funding_program_id" integer NULL;

ALTER TABLE "public"."moped_proj_funding" ADD COLUMN "funding_amount" integer NULL;

ALTER TABLE "public"."moped_proj_funding" ADD COLUMN "fund_dept_unit" text NULL;

ALTER TABLE "public"."moped_proj_funding" ADD COLUMN "funding_description" text NULL;

ALTER TABLE "public"."moped_proj_funding" ADD COLUMN "funding_status_id" integer NULL;

ALTER TABLE "public"."moped_proj_funding" DROP COLUMN "funding_source_name" CASCADE;

ALTER TABLE "public"."moped_proj_funding" DROP COLUMN "funding_source_category" CASCADE;

ALTER TABLE "public"."moped_proj_funding" DROP COLUMN "funding_source_other" CASCADE;

alter table "public"."moped_proj_funding"
           add constraint "moped_proj_funding_funding_source_id_fkey"
           foreign key ("funding_source_id")
           references "public"."moped_fund_sources"
           ("funding_source_id") on update restrict on delete restrict;

alter table "public"."moped_fund_sources" drop constraint "moped_fund_sources_funding_source_category_fkey";

alter table "public"."moped_fund_source_cat" rename to "moped_fund_programs";

alter table "public"."moped_fund_programs" rename column "funding_source_category_id" to "funding_program_id";

alter table "public"."moped_fund_programs" rename column "funding_source_category_name" to "funding_program_name";

CREATE TABLE "public"."moped_fund_status"("funding_status_id" serial NOT NULL, "funding_status_name" text NOT NULL, PRIMARY KEY ("funding_status_id") , UNIQUE ("funding_status_id"), UNIQUE ("funding_status_name"));

alter table "public"."moped_proj_funding"
           add constraint "moped_proj_funding_funding_program_id_fkey"
           foreign key ("funding_program_id")
           references "public"."moped_fund_programs"
           ("funding_program_id") on update restrict on delete restrict;

alter table "public"."moped_proj_funding"
           add constraint "moped_proj_funding_funding_status_id_fkey"
           foreign key ("funding_status_id")
           references "public"."moped_fund_status"
           ("funding_status_id") on update restrict on delete restrict;
