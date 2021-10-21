alter table "public"."moped_entity" rename column "entity_name" to "workgroup_name";

DELETE FROM public.moped_entity;
