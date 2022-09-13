alter table "public"."moped_subphases" drop constraint "moped_subphases_subphase_order_key";
alter table "public"."moped_subphases" alter column "subphase_order" drop not null;
