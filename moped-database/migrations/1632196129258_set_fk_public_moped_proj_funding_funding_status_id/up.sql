alter table "public"."moped_proj_funding"
           add constraint "moped_proj_funding_funding_status_id_fkey"
           foreign key ("funding_status_id")
           references "public"."moped_fund_status"
           ("funding_status_id") on update restrict on delete restrict;
