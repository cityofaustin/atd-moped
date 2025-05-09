/* Rename primary key */
alter table "public"."moped_users"
    rename constraint "moped_users_pkey"
        to "moped_coa_staff_pkey";

/* Rename foreign key */
alter table "public"."moped_users"
    rename constraint "moped_users_workgroup_id_fkey"
        to "moped_coa_staff_workgroup_id_fkey";

/* Rename unique key */
alter table "public"."moped_users"
    rename constraint "moped_users_user_id_key"
        to "moped_coa_staff_staff_id_key";

/* Rename sequence */
alter sequence "public"."moped_users_user_id_seq"
    rename to "moped_users_staff_id_seq";
