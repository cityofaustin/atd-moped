DELETE FROM "public"."moped_components" WHERE "component_subtype" = 'Street lighting';
DELETE FROM "public"."moped_components" WHERE "component_subtype" = 'Intersection lighting';
DELETE FROM "public"."moped_components" WHERE "component_subtype" = 'Bus stop';

UPDATE "public"."moped_components"
SET line_representation = false
WHERE component_id = 0;
