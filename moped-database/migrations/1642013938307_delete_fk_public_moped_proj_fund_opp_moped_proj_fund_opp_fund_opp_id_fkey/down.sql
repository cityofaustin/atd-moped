alter table "public"."moped_proj_fund_opp" add foreign key ("fund_opp_id") references "public"."moped_fund_opp"("funding_opportunity_id") on update restrict on delete restrict;
