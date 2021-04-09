COMMENT ON TABLE "public"."moped_categories" IS E'DELETE unless needed; categories are project types in IMPD';
COMMENT ON TABLE "public"."moped_city_fiscal_years" IS E'DELETE';
alter table "public"."moped_components" rename to "moped_component_types";
COMMENT ON TABLE "public"."moped_component_types" IS E'Project facility types or component types; associated with moped_components';
COMMENT ON TABLE "public"."moped_entity" IS E'DELETE';
COMMENT ON TABLE "public"."moped_fund_opp" IS E'DELETE';
COMMENT ON TABLE "public"."moped_group" IS E'DELETE';
COMMENT ON TABLE "public"."moped_proj_categories" IS E'DELETE unless needed; categories are project types in IMPD';
