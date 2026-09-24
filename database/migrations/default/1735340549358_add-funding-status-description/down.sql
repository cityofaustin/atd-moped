-- Remove the funding_status_description column
ALTER TABLE "public"."moped_fund_status" 
DROP COLUMN "funding_status_description";
