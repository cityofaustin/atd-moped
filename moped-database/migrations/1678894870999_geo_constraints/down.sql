ALTER TABLE "public"."features" ALTER COLUMN "component_id" DROP NOT NULL;
ALTER TABLE "public"."feature_signals" ALTER COLUMN "component_id" DROP NOT NULL;
ALTER TABLE "public"."feature_signals" ALTER COLUMN "knack_id" DROP NOT NULL;
ALTER TABLE "public"."feature_signals" ALTER COLUMN "geography" DROP NOT NULL;
ALTER TABLE "public"."feature_signals" ALTER COLUMN "geography" SET DEFAULT NULL::geography;
ALTER TABLE "public"."feature_signals" ALTER COLUMN "signal_type" DROP NOT NULL;
ALTER TABLE "public"."feature_signals" ALTER COLUMN "location_name" DROP NOT NULL;
ALTER TABLE "public"."feature_signals" ALTER COLUMN "signal_id" DROP NOT NULL;

ALTER TABLE "public"."features"
    ADD COLUMN name text;

ALTER TABLE "public"."feature_street_segments"
    ADD COLUMN knack_id text,
        ADD COLUMN project_extent_id uuid,
            ADD COLUMN render_type text;

ALTER TABLE "public"."feature_intersections"
    ADD COLUMN project_extent_id uuid, DRADDOP COLUMN render_type text;

ALTER TABLE "public"."feature_drawn_lines"
    ADD COLUMN render_type text;

ALTER TABLE "public"."feature_drawn_points"
    ADD COLUMN render_type text;
