DROP TABLE "public"."moped_project_types";

CREATE TABLE public.moped_categories (
    category_name text NOT NULL,
    category_id integer NOT NULL,
    active_category boolean DEFAULT true NOT NULL,
    on_street boolean,
    sensitivity boolean,
    category_order integer NOT NULL,
    date_added timestamp with time zone DEFAULT clock_timestamp()
);

COMMENT ON TABLE public.moped_categories IS 'Standardized categories for projects';

CREATE TABLE public.moped_proj_categories (
    project_id integer NOT NULL,
    category_name text NOT NULL,
    proj_category_id integer NOT NULL,
    date_added timestamp with time zone DEFAULT clock_timestamp(),
    added_by integer
);

COMMENT ON TABLE public.moped_proj_categories IS 'List of related project categories';

INSERT INTO public.moped_categories (category_name, category_id, active_category, on_street, sensitivity, category_order, date_added) VALUES ('CIP', 1, true, NULL, NULL, 1, '2020-10-09 13:37:32.779628+00');
INSERT INTO public.moped_categories (category_name, category_id, active_category, on_street, sensitivity, category_order, date_added) VALUES ('Lane Conversion', 2, true, NULL, NULL, 2, '2020-10-09 13:37:50.460015+00');
INSERT INTO public.moped_categories (category_name, category_id, active_category, on_street, sensitivity, category_order, date_added) VALUES ('Parking Mod', 3, true, NULL, NULL, 3, '2020-10-09 13:38:56.504668+00');
INSERT INTO public.moped_categories (category_name, category_id, active_category, on_street, sensitivity, category_order, date_added) VALUES ('Private Development', 4, true, NULL, NULL, 10, '2020-10-09 13:39:09.593212+00');
INSERT INTO public.moped_categories (category_name, category_id, active_category, on_street, sensitivity, category_order, date_added) VALUES ('New Road', 5, true, NULL, NULL, 6, '2020-10-09 13:39:23.93937+00');
INSERT INTO public.moped_categories (category_name, category_id, active_category, on_street, sensitivity, category_order, date_added) VALUES ('Plan', 6, true, NULL, NULL, 8, '2020-10-09 13:39:31.616226+00');
INSERT INTO public.moped_categories (category_name, category_id, active_category, on_street, sensitivity, category_order, date_added) VALUES ('Operations', 7, true, NULL, NULL, 9, '2020-10-09 13:39:41.544508+00');
INSERT INTO public.moped_categories (category_name, category_id, active_category, on_street, sensitivity, category_order, date_added) VALUES ('Lane Width', 8, true, NULL, NULL, 12, '2020-10-09 13:39:51.594248+00');

