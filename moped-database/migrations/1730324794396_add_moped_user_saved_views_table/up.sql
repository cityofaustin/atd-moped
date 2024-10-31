CREATE TABLE public.moped_user_saved_views (
    id serial NOT NULL,
    description text,
    url text NOT NULL,
    query_filters jsonb,
    created_by_user_id int4 NOT NULL,
    updated_by_user_id int4 NOT NULL,
    is_deleted boolean NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE moped_user_saved_views
ADD CONSTRAINT fk_moped_user_saved_views_created_by FOREIGN KEY (created_by_user_id) REFERENCES moped_users (user_id),
ADD CONSTRAINT fk_moped_user_saved_views_updated_by FOREIGN KEY (updated_by_user_id) REFERENCES moped_users (user_id);

-- Adding comments for audit fields
COMMENT ON COLUMN moped_user_saved_views.created_at IS 'Timestamp of when the view was created';
COMMENT ON COLUMN moped_user_saved_views.created_by_user_id IS 'User ID of the creator of the view';
COMMENT ON COLUMN moped_user_saved_views.updated_by_user_id IS 'User ID of the last updater of the view';
COMMENT ON COLUMN moped_user_saved_views.updated_at IS 'Timestamp of the last update of the view';

-- Adding comments for moped_user_saved_views constraints
COMMENT ON CONSTRAINT fk_moped_user_saved_views_created_by ON moped_user_saved_views IS 'Foreign key constraint linking created_by_user_id to moped_users table.';
COMMENT ON CONSTRAINT fk_moped_user_saved_views_updated_by ON moped_user_saved_views IS 'Foreign key constraint linking updated_by_user_id to moped_users table.';
