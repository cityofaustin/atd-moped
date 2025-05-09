DROP TRIGGER IF EXISTS set_updated_at_before_insert_or_update ON public.moped_proj_components;

ALTER TABLE public.moped_proj_components DROP COLUMN IF EXISTS updated_at;

ALTER TABLE public.moped_proj_components DROP COLUMN IF EXISTS updated_by_user_id;

ALTER TABLE public.moped_proj_components DROP COLUMN IF EXISTS created_by_user_id;

ALTER TABLE public.moped_proj_components RENAME COLUMN created_at TO date_added;
