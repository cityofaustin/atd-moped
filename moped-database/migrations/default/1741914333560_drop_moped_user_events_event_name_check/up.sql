-- Drop the check constraint so we can add future event names without a DB migration
ALTER TABLE moped_user_events DROP CONSTRAINT IF EXISTS moped_user_events_event_name_check;
