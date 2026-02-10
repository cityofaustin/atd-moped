-- Restore the check constraint with the event names that existed before this migration
ALTER TABLE moped_user_events
ADD CONSTRAINT moped_user_events_event_name_check CHECK (event_name IN ('app_load', 'dashboard_load', 'projects_map_load', 'projects_saved_view'));
