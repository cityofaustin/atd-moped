CREATE TABLE "public"."moped_fund_status"("funding_status_id" serial NOT NULL, "funding_status_name" text NOT NULL, PRIMARY KEY ("funding_status_id") , UNIQUE ("funding_status_id"), UNIQUE ("funding_status_name"));
