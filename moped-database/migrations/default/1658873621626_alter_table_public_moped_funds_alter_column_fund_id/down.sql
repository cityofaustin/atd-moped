DELETE FROM "public"."moped_funds" WHERE "fund_id" = '8181';
DELETE FROM "public"."moped_funds" WHERE "fund_id" = '820B';
DELETE FROM "public"."moped_funds" WHERE "fund_id" = '8401';

ALTER TABLE "public"."moped_funds" ALTER COLUMN "fund_id" TYPE integer;
