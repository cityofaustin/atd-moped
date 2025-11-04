-- Add MAP Bikeways 2026 and 2027 component tags and MAP Bikeways 2026 project tag
INSERT INTO public.moped_component_tags (type, name, slug) VALUES
('MAP Signals', '2026', 'map_signals_2026'),
('MAP Bikeshare', '2025', 'map_bikeshare_2025'),
('MAP Bikeshare', '2026', 'map_bikeshare_2026'),
('Arterial Management', 'PIP', 'arterial_management_pip');

INSERT INTO moped_tags (name, type, slug, is_deleted) VALUES
('MAP Bikeways 2026', 'Work Plan', 'map_bikeways_2026', FALSE),
('Arterial Management - PIP', 'Other', 'arterial_management_pip', FALSE);
