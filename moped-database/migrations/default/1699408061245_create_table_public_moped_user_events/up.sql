ALTER TABLE "public"."moped_users"
    ADD COLUMN "last_seen_date" timestamptz NULL;

COMMENT ON COLUMN moped_users.last_seen_date IS 'Tracks the last time a user loaded the Moped app in their browser. This value is set by the set_last_seen_date function. This value is not 100% reliable because it is updated by an API call that can be blocked by the client.';


CREATE TABLE "public"."moped_user_events" (
    "id" serial NOT NULL,
    "user_id" integer NOT NULL,
    "event_name" text NOT NULL CHECK (event_name in('app_load')),
    "created_at" timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY ("id"),
    FOREIGN KEY ("user_id") REFERENCES "public"."moped_users" ("user_id") ON UPDATE CASCADE ON DELETE CASCADE
);

COMMENT ON TABLE "public"."moped_user_events" IS E'Tracks user activities for analytics purposes';

CREATE FUNCTION public.set_user_last_seen_date ()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE
        moped_users
    SET
        last_seen_date = NEW.created_at
    WHERE
        user_id = NEW.user_id;
    RETURN NEW;
END;
$$;

CREATE TRIGGER set_user_last_seen_date_trigger
    AFTER INSERT ON public.moped_user_events
    FOR EACH ROW
    EXECUTE FUNCTION public.set_user_last_seen_date ();

COMMENT ON FUNCTION set_user_last_seen_date IS 'Updates the moped_users.last_seen_date based on inserts into the moped_user_events table';
