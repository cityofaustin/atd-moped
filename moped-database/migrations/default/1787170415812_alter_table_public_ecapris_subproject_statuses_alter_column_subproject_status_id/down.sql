CREATE TEMP TABLE ecapris_dependent_view_definitions ON COMMIT DROP AS
SELECT view_name, pg_get_viewdef(to_regclass(format('public.%I', view_name)), true) AS definition
FROM (VALUES
	('combined_project_notes_view'),
	('project_list_view'),
	('component_arcgis_online_view'),
	('exploded_component_arcgis_online_view')
) AS dependent_views(view_name)
WHERE to_regclass(format('public.%I', view_name)) IS NOT NULL;

DROP VIEW IF EXISTS public.exploded_component_arcgis_online_view;
DROP VIEW IF EXISTS public.component_arcgis_online_view;
DROP VIEW IF EXISTS public.project_list_view;
DROP VIEW IF EXISTS public.combined_project_notes_view;

ALTER TABLE public.ecapris_subproject_statuses
ALTER COLUMN id TYPE integer;

ALTER SEQUENCE public.ecapris_subproject_statuses_id_seq AS integer;

DO $$
DECLARE
	dependent_view RECORD;
BEGIN
	FOR dependent_view IN
		SELECT view_name, definition
		FROM ecapris_dependent_view_definitions
		ORDER BY CASE view_name
			WHEN 'combined_project_notes_view' THEN 1
			WHEN 'project_list_view' THEN 2
			WHEN 'component_arcgis_online_view' THEN 3
			WHEN 'exploded_component_arcgis_online_view' THEN 4
		END
	LOOP
		EXECUTE format('CREATE VIEW public.%I AS %s', dependent_view.view_name, dependent_view.definition);
	END LOOP;
END;
$$;