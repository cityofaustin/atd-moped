CREATE TABLE "public"."moped_funds"("id" serial NOT NULL, "fund_id" integer NOT NULL, "fund_name" text NOT NULL, PRIMARY KEY ("id") , UNIQUE ("id"));

INSERT INTO "public"."moped_funds"(id, fund_id, fund_name)
VALUES (1, 5125, 'MOBILITY FUND'),
       (2, 5390, 'TRANSPORTATION INVENTORY FUND'),
       (3, 5610, 'PARKING MANAGEMENT FUND'),
       (4, 7026, 'I-35 PARKING PROGRAM FUND'),
       (5, 8112, 'GCP TRANSPORTATION'),
       (6, 8119, 'GCP-MOBILITY P1/2016'),
       (7, 8127, '2018 BOND'),
       (8, 8400, 'CIP IMPROVEMENTS FUND'),
       (9, 8581, 'QUARTER CENT FUND'),
       (10, 8950, 'GCP GRANTS FUN');
