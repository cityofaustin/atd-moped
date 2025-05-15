-- copy component <> subcomponent relationships from public.moped_subcomponents
INSERT INTO public.moped_components_subcomponents (component_id, subcomponent_id)
SELECT
    component_id,
    subcomponent_id
FROM
    public.moped_subcomponents ORDER BY subcomponent_id asc;

-- update references to dupe subcomponents (except raised pavement marker)
update public.moped_proj_components_subcomponents set subcomponent_id = 1 where subcomponent_id = 4;
update public.moped_proj_components_subcomponents set subcomponent_id = 2 where subcomponent_id = 5;
update public.moped_proj_components_subcomponents set subcomponent_id = 3 where subcomponent_id = 6;
update public.moped_proj_components_subcomponents set subcomponent_id = 1 where subcomponent_id = 7;
update public.moped_proj_components_subcomponents set subcomponent_id = 2 where subcomponent_id = 8;
update public.moped_proj_components_subcomponents set subcomponent_id = 3 where subcomponent_id = 9;
-- copy the "raised pavement markers" component into subcomponent ID #4
update public.moped_subcomponents set subcomponent_name = 'Raised pavement markers' where subcomponent_id = 4;
-- update all refeference to dupe raised pavement marker subcomponent
update public.moped_proj_components_subcomponents set subcomponent_id = 4 where subcomponent_id = 10;
update public.moped_proj_components_subcomponents set subcomponent_id = 4 where subcomponent_id = 11;
update public.moped_proj_components_subcomponents set subcomponent_id = 4 where subcomponent_id = 12;
update public.moped_proj_components_subcomponents set subcomponent_id = 4 where subcomponent_id = 13;
update public.moped_proj_components_subcomponents set subcomponent_id = 4 where subcomponent_id = 14;
update public.moped_proj_components_subcomponents set subcomponent_id = 4 where subcomponent_id = 15;
update public.moped_proj_components_subcomponents set subcomponent_id = 4 where subcomponent_id = 16;
update public.moped_proj_components_subcomponents set subcomponent_id = 4 where subcomponent_id = 17;
update public.moped_proj_components_subcomponents set subcomponent_id = 4 where subcomponent_id = 18;
-- and now we need to do this for our new moped_components_subcomponents table
update public.moped_components_subcomponents set subcomponent_id = 1 where subcomponent_id = 4;
update public.moped_components_subcomponents set subcomponent_id = 2 where subcomponent_id = 5;
update public.moped_components_subcomponents set subcomponent_id = 3 where subcomponent_id = 6;
update public.moped_components_subcomponents set subcomponent_id = 1 where subcomponent_id = 7;
update public.moped_components_subcomponents set subcomponent_id = 2 where subcomponent_id = 8;
update public.moped_components_subcomponents set subcomponent_id = 3 where subcomponent_id = 9;
update public.moped_components_subcomponents set subcomponent_id = 4 where subcomponent_id = 10;
update public.moped_components_subcomponents set subcomponent_id = 4 where subcomponent_id = 11;
update public.moped_components_subcomponents set subcomponent_id = 4 where subcomponent_id = 12;
update public.moped_components_subcomponents set subcomponent_id = 4 where subcomponent_id = 13;
update public.moped_components_subcomponents set subcomponent_id = 4 where subcomponent_id = 14;
update public.moped_components_subcomponents set subcomponent_id = 4 where subcomponent_id = 15;
update public.moped_components_subcomponents set subcomponent_id = 4 where subcomponent_id = 16;
update public.moped_components_subcomponents set subcomponent_id = 4 where subcomponent_id = 17;
update public.moped_components_subcomponents set subcomponent_id = 4 where subcomponent_id = 18;

-- ok, now delete all those redundant subcomponents
DELETE FROM public.moped_subcomponents WHERE subcomponent_id > 4;
-- and reset the table ID sequence
SELECT setval('moped_subcomponents_subcomponent_id_seq', 5, TRUE);

-- and add a unique constraint on the name for good measure
ALTER table public.moped_subcomponents add constraint subcomponent_name_unique UNIQUE (subcomponent_name);
-- and drop the component_id column, which has moved to moped_components_subcomponents
ALTER table public.moped_subcomponents drop column component_id;
