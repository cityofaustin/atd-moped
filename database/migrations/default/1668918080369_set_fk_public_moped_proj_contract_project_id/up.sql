alter table "public"."moped_proj_contract" drop constraint "moped_purchase_order_project_id_fkey",
  add constraint "moped_proj_contract_project_id_fkey"
  foreign key ("project_id")
  references "public"."moped_project"
  ("project_id") on update cascade on delete cascade;
