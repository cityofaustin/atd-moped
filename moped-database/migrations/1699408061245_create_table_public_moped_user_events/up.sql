CREATE TABLE "public"."moped_user_events" (
    "id" serial NOT NULL,
    "user_id" integer NOT NULL,
    "description" text NOT NULL,
    "event_date" timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY ("id"),
    FOREIGN KEY ("user_id") REFERENCES "public"."moped_users" ("user_id") ON UPDATE CASCADE ON DELETE CASCADE
);

COMMENT ON TABLE "public"."moped_user_events" IS E'Tracks user activities for analytics purposes';
