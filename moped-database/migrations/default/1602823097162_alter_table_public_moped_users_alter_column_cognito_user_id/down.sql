/* Type-cast into UUID */
alter table "public"."moped_users"
    alter column cognito_user_id type text using cognito_user_id::text;

/* Creates unique constraint */
alter table "public"."moped_users"
    drop constraint "moped_users_cognito_user_id_key";

