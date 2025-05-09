ALTER TABLE "public"."moped_users" DROP COLUMN "email";

DROP INDEX moped_users_unique_email_idx ON "public"."moped_users";
