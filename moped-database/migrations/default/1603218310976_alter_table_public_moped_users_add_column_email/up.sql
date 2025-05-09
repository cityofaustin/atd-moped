ALTER TABLE "public"."moped_users" ADD COLUMN "email" citext NOT NULL UNIQUE;

CREATE UNIQUE INDEX moped_users_unique_email_idx ON "public"."moped_users" (email);
