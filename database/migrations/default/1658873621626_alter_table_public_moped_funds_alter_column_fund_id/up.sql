ALTER TABLE "public"."moped_funds" ALTER COLUMN "fund_id" TYPE text;

INSERT INTO "public"."moped_funds"(
  "fund_id", "fund_name") 
VALUES 
  (E'8181', E'2010 MOBILITY BOND'),
  (E'820B', E'2020 BOND'),
  (E'8401', E'ATD TRANSPORTATION CIP');

