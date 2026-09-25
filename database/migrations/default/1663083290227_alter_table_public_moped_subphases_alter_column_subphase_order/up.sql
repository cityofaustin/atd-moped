alter table "public"."moped_subphases" alter column "subphase_order" set not null;
alter table "public"."moped_subphases" add constraint "moped_subphases_subphase_order_key" unique ("subphase_order");
