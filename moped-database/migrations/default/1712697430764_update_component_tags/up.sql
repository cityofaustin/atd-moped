INSERT INTO public.moped_component_tags ("type", name, slug) VALUES
('MAP Ped Crossing', '2025', 'map_ped_crossing_2025'),
('MAP Ped Crossing', 'Future', 'map_ped_crossing_future'),
('MAP Vision Zero', 'Major Safety', 'map_vision_zero_major_safety'),
('MAP Vision Zero', 'Ped Safety', 'map_vision_zero_ped_safety'),
('MAP Vision Zero', 'Rapid Response/Small Scale', 'map_vision_zero_rapid_response_small_scale'),
('MAP Vision Zero', 'Speed Management', 'map_vision_zero_speed_management'),
('MAP Vision Zero', 'Street Lighting', 'map_vision_zero_street_lighting'),
('MAP Vision Zero', 'Systemic Safety', 'map_vision_zero_systemic_safety'),
('MAP Vision Zero', 'Systemic Safety Curves', 'map_vision_zero_systemic_safety_curves'),
('MAP Signals', '', 'map_signals'),
('MAP SRTS', '', 'map_srts'),
('MAP Transit Enhancement', '', 'map_transit_enhancement'),
('MAP Transit Speed and Reliability (CapMetro ILA)', '', 'map_transit_speed_reliability');

UPDATE public.moped_component_tags SET "type" = 'MAP Bikeways' WHERE slug IN ('bikeways_work_plan_2017', 'bikeways_work_plan_2018', 'bikeways_work_plan_2019', 'bikeways_work_plan_2020', 'bikeways_work_plan_2021', 'bikeways_work_plan_2022', 'bikeways_work_plan_2023', 'bikeways_work_plan_2024', 'bikeways_work_plan_future');
