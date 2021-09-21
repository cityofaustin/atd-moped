alter table "public"."moped_proj_funding"
           add constraint "moped_proj_funding_funding_source_id_fkey"
           foreign key ("funding_source_id")
           references "public"."moped_fund_sources"
           ("funding_source_id") on update restrict on delete restrict;
