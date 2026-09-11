CREATE TABLE "public"."moped_types"("type_name" text NOT NULL, "type_id" serial NOT NULL, "active_type" boolean NOT NULL DEFAULT True, "on_street" boolean, "sensitivity" boolean, "type_order" integer NOT NULL, "date_added" timestamptz DEFAULT clock_timestamp(), PRIMARY KEY ("type_id") , UNIQUE ("type_id"), UNIQUE ("type_name"));

INSERT INTO "public"."moped_types"(type_id, type_name, type_order)
VALUES (1, 'Signal - Mod', 4),
       (2, 'Signal - New', 5),
       (3, 'RRFB - New', 3),
       (4, 'PHB - New', 2),
       (5, 'PHB - Mod', 1);

