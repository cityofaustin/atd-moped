CREATE TABLE "public"."moped_purchase_order" (
  "id" serial NOT NULL,
  "vendor" text,
  "purchase_order_number" text,
  "description" text,
  "project_id" integer NOT NULL,
  "is_deleted" bool NOT NULL DEFAULT false,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("project_id") REFERENCES "public"."moped_project"("project_id") ON UPDATE cascade ON DELETE restrict);
COMMENT ON TABLE "public"."moped_purchase_order" IS E'Table to track multiple contracts and purchase orders for projects';
