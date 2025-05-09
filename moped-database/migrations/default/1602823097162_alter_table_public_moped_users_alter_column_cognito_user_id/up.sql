/* Type-cast into UUID */
alter table "public"."moped_users"
    alter column cognito_user_id type uuid using cognito_user_id::uuid;

/* Creates unique constraint */
alter table "public"."moped_users"
    add constraint "moped_users_cognito_user_id_key"
        unique ("cognito_user_id");
