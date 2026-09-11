ALTER TABLE "public"."features" DROP COLUMN name, ALTER COLUMN "component_id" SET NOT NULL;

ALTER TABLE "public"."feature_signals"
    DROP COLUMN render_type,
    ALTER COLUMN "signal_id" SET NOT NULL,
    ALTER COLUMN "location_name" SET NOT NULL,
    ALTER COLUMN "signal_type" SET NOT NULL,
    ALTER COLUMN "geography" DROP DEFAULT,
    ALTER COLUMN "geography" SET NOT NULL,
    ALTER COLUMN "is_deleted" SET NOT NULL,
    ALTER COLUMN "knack_id" SET NOT NULL;

ALTER TABLE "public"."feature_street_segments"
    DROP COLUMN knack_id,
    DROP COLUMN project_extent_id,
    DROP COLUMN render_type,
    ALTER COLUMN "is_deleted" SET NOT NULL,
    ALTER COLUMN "ctn_segment_id" SET NOT NULL,
    ALTER COLUMN "source_layer" SET NOT NULL,
    ALTER COLUMN "geography" DROP DEFAULT,
    ALTER COLUMN "geography" SET NOT NULL;

ALTER TABLE "public"."feature_intersections"
    DROP COLUMN project_extent_id,
    DROP COLUMN render_type,
    ALTER COLUMN "is_deleted" SET NOT NULL,
    ALTER COLUMN "intersection_id" SET NOT NULL,
    ALTER COLUMN "source_layer" SET NOT NULL,
    ALTER COLUMN "geography" DROP DEFAULT,
    ALTER COLUMN "geography" SET NOT NULL;

ALTER TABLE "public"."feature_drawn_lines"
    DROP COLUMN render_type,
    ALTER COLUMN "is_deleted" SET NOT NULL,
    ALTER COLUMN "project_extent_id" SET NOT NULL,
    ALTER COLUMN "source_layer" SET NOT NULL,
    ALTER COLUMN "geography" DROP DEFAULT,
    ALTER COLUMN "geography" SET NOT NULL;

ALTER TABLE "public"."feature_drawn_points"
    DROP COLUMN render_type,
    ALTER COLUMN "is_deleted" SET NOT NULL,
    ALTER COLUMN "project_extent_id" SET NOT NULL,
    ALTER COLUMN "source_layer" SET NOT NULL,
    ALTER COLUMN "geography" DROP DEFAULT,
    ALTER COLUMN "geography" SET NOT NULL;
