   ALTER TABLE "public"."moped_fund_status" 
   ADD COLUMN "funding_status_description" text NULL;

   COMMENT ON COLUMN "public"."moped_fund_status"."funding_status_description" IS 'Description of the funding status';

   UPDATE "public"."moped_fund_status"
   SET "funding_status_description" = CASE "funding_status_name"
       WHEN 'Tentative' THEN 'In conversation about possible funding commitment'
       WHEN 'Confirmed' THEN 'Commitment to funding'
       WHEN 'Available' THEN 'Funding is available, e.g. private developer'
       WHEN 'Funding setup requested' THEN NULL
       WHEN 'Set up' THEN 'Funding has been set up in eCAPRIS; has FDU'
       ELSE "funding_status_description"
   END;