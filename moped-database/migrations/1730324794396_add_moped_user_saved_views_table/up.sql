CREATE TABLE public.moped_user_saved_views (
    id serial NOT NULL,
    description text NOT NULL,
    url text NOT NULL,
    query_filters jsonb,
    created_by_user_id int4 NOT NULL,
    updated_by_user_id int4 NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    is_deleted boolean NOT NULL DEFAULT false
);

ALTER TABLE moped_user_saved_views
ADD CONSTRAINT fk_moped_user_saved_views_created_by FOREIGN KEY (created_by_user_id) REFERENCES moped_users (user_id),
ADD CONSTRAINT fk_moped_user_saved_views_updated_by FOREIGN KEY (updated_by_user_id) REFERENCES moped_users (user_id);

-- Adding comments for audit fields
COMMENT ON COLUMN moped_user_saved_views.description IS 'Description entered by the creator of the view';
COMMENT ON COLUMN moped_user_saved_views.url IS 'URL string associated with the view (may break if database fields or operators are changed)';
COMMENT ON COLUMN moped_user_saved_views.query_filters IS 'JSON blob of filters that make up the query';
COMMENT ON COLUMN moped_user_saved_views.created_by_user_id IS 'User ID of the creator of the view';
COMMENT ON COLUMN moped_user_saved_views.updated_by_user_id IS 'User ID of the last updater of the view';
COMMENT ON COLUMN moped_user_saved_views.created_at IS 'Timestamp of when the view was created';
COMMENT ON COLUMN moped_user_saved_views.updated_at IS 'Timestamp of the last update of the view';
COMMENT ON COLUMN moped_user_saved_views.query_filters IS 'Boolean indicating whether the view has been soft deleted and thereby not rendered in the UI';

-- Adding comments for moped_user_saved_views constraints
COMMENT ON CONSTRAINT fk_moped_user_saved_views_created_by ON moped_user_saved_views IS 'Foreign key constraint linking created_by_user_id to moped_users table.';
COMMENT ON CONSTRAINT fk_moped_user_saved_views_updated_by ON moped_user_saved_views IS 'Foreign key constraint linking updated_by_user_id to moped_users table.';

CREATE TRIGGER set_moped_user_saved_views_updated_at
BEFORE INSERT OR UPDATE ON moped_user_saved_views
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TRIGGER set_moped_user_saved_views_updated_at ON public.moped_user_saved_views IS 'Trigger to set updated_at timestamp for each insert or update on moped_user_saved_views';
