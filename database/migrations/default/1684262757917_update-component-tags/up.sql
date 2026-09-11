-- this is ok because this feature is not yet in production!
DELETE FROM moped_proj_component_tags WHERE 1 = 1;
SELECT setval('moped_proj_component_tags_id_seq', 1, false);
DELETE FROM moped_component_tags WHERE 1 = 1;
SELECT setval('moped_component_tags_id_seq', 1, false);

INSERT INTO public.moped_component_tags ("type", name, slug) values
    ('Bikeways - AAA Network', '2014 Plan', 'bikeways_aaa_network_2014_plan'),
    ('Bikeways - AAA Network', '2019 Plan', 'bikeways_aaa_network_2019_plan'),
    ('Bikeways - AAA Network', '2023 Plan', 'bikeways_aaa_network_2023_plan'),
    ('Bikeways - AAA Network', 'Proposed', 'bikeways_aaa_network_proposed'),
    ('Bikeways - AAA Network', 'Other Jurisdiction', 'bikeways_aaa_network_other_jurisdiction'),
    ('Bikeways - Work Plan', '2017', 'bikeways_work_plan_2017'),
    ('Bikeways - Work Plan', '2018', 'bikeways_work_plan_2018'),
    ('Bikeways - Work Plan', '2019', 'bikeways_work_plan_2019'),
    ('Bikeways - Work Plan', '2020', 'bikeways_work_plan_2020'),
    ('Bikeways - Work Plan', '2021', 'bikeways_work_plan_2021'),
    ('Bikeways - Work Plan', '2022', 'bikeways_work_plan_2022'),
    ('Bikeways - Work Plan', '2023', 'bikeways_work_plan_2023'),
    ('Bikeways - Work Plan', 'Future', 'bikeways_work_plan_future'),
    ('Urban Trails', 'Tier 1', 'urban_trails_tier_1'),
    ('Urban Trails', 'Tier 2-3', 'urban_trails_tier_2_3'),
    ('Urban Trails', 'Connector', 'urban_trails_connector'),
    ('Urban Trails', 'Sidepath', 'urban_trails_sidepath'),
    ('Bikeways', 'Access To Nature', 'bikeways_access_to_nature'),
    ('Bikeways - Performance Measure', 'Arterial', 'bikeways_performance_measure_arterial'),
    ('Bikeways - Performance Measure', 'Upgrades Existing', 'bikeways_performance_measure_upgrades_existing');
