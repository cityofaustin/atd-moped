CREATE TABLE "public"."moped_organization"("organization_id" serial NOT NULL, "organization_name" text NOT NULL, "organization_abbreviation" text, PRIMARY KEY ("organization_id") );

INSERT INTO "public"."moped_organization"(organization_id, organization_name, organization_abbreviation)
VALUES (1, 'City of Austin', 'COA'),
       (2, 'Capital Metro Transportation Authority', 'CMTA'),
       (3, 'Central Texas Regional Mobility Authority', 'CTRMA'),
       (4, 'State of Texas', NULL),
       (5, 'City of Sunset Valley', NULL),
       (6, 'Travis County', NULL),
       (7, 'Texas Department of Transportation', 'TXDOT'),
       (8, 'Williamson County', NULL),
       (9, 'Private Developer', NULL),
       (10, 'Private Partner', NULL),
       (11, 'Private Partner - Hill Country Conservancy', NULL),
       (12, 'Private Partner - Mueller Foundation', NULL);
