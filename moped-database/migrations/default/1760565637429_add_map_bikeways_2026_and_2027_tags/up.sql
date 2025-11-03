-- Add MAP Bikeways 2026 and 2027 component tags and MAP Bikeways 2026 project tag
INSERT INTO public.moped_component_tags (type, name, slug) VALUES
('MAP Bikeways', '2026', 'map_bikeways_2026'),
('MAP Bikeways', '2027', 'map_bikeways_2027');

INSERT INTO moped_tags (name, type, slug, is_deleted) VALUES
('MAP Bikeways 2026', 'Work Plan', 'map_bikeways_2026', FALSE);
