DELETE FROM moped_user_events WHERE event_name = 'projects_map_load';

ALTER TABLE moped_user_events DROP CONSTRAINT moped_user_events_event_name_check;

ALTER TABLE moped_user_events
ADD CONSTRAINT moped_user_events_event_name_check CHECK (event_name IN ('app_load', 'dashboard_load'));
