INSERT INTO "public"."moped_components"(
	"component_name", "status_id", "component_subtype", "line_representation") 
VALUES 
	(E'Lighting', 1, E'Street lighting', true),
	(E'Lighting', 1, E'Intersection lighting', false),
	(E'Transit', 1, E'Bus stop', false);

UPDATE "public"."moped_components"
SET line_representation = true
WHERE component_id = 0;
