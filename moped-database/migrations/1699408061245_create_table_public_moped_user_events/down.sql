DROP TRIGGER set_user_last_seen_date_trigger;

DROP FUNCTION set_user_last_seen_date;

DROP TABLE "public"."moped_user_events";

ALTER TABLE "public"."moped_users" DROP COLUMN "last_seen_date";
