UPDATE "public"."moped_tags" SET "name" = 'Arterial Management', "slug" = 'arterial_management' WHERE "slug" = 'arterial_management_inspection';
DELETE FROM "public"."moped_tags" WHERE "slug" = 'arterial_management_request';
DELETE FROM "public"."moped_tags" WHERE "slug" = 'street_impact_fee';
