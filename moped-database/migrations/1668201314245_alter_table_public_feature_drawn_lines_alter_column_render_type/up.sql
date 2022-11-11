alter table "public"."feature_drawn_lines" alter column "render_type" set default 'line';
alter table "public"."feature_drawn_points" alter column "render_type" set default 'point';
alter table "public"."feature_intersections" alter column "render_type" set default 'point';
alter table "public"."feature_signals" alter column "render_type" set default 'point';
alter table "public"."feature_street_segments" alter column "render_type" set default 'line';
