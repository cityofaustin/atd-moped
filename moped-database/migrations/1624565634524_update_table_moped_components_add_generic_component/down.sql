/* Delete extent project component */
DELETE FROM public.moped_components WHERE component_id = 0;

/* Then delete the rest of the components in the migration */
DELETE FROM public.moped_components
    WHERE component_id >= 19 AND component_id <= 59;
